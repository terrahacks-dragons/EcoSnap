import express from 'express';
import fetch from 'node-fetch';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

// Construct __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Ensure the uploads and processed directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir);
}

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static(publicDir));

// Serve static files from the "processed" directory
app.use('/processed', express.static(processedDir));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Serve the Menu-Companion.html at the root URL
app.get('/menu-companion', (req, res) => {
    res.sendFile(path.join(publicDir, 'Menu-Companion.html'));
});

// API endpoint for analyzing images
app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };

        const payload = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Please analyze the following image and provide the information in the strict JSON format below. ' +
                                'Fill in each field with the data you can extract from the image. ' +
                                'If you cannot determine a particular field, leave it as an empty string. ' +
                                'The format should be as follows:' +
                                '\n\n' +
                                '{\n' +
                                '  "content": {\n' +
                                '    "item_name": "",\n' +
                                '    "calories": "",\n' +
                                '    "score": "",\n' +
                                '    "description": ""\n' +
                                '  }\n' +
                                '}\n\n' +
                                'Please include the item name, estimated calories, sustainability score out of 5, and a brief description of the food item. ' +
                                'If the item is not food, you can leave all fields as empty strings.'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Full API Response:', JSON.stringify(data, null, 2)); // Log full response for debugging

        const messageContent = data.choices[0].message.content;

        // Remove extra formatting and parse JSON content
        const cleanedContent = messageContent
            .replace(/```json\n|\n```/g, '') // Remove ```json\n and \n```
            .trim();

        let parsedContent;
        try {
            parsedContent = JSON.parse(cleanedContent);
        } catch (error) {
            console.error('Error parsing JSON content:', error);
            return res.status(500).json({ error: 'Failed to parse JSON content' });
        }

        if (!parsedContent.content) {
            return res.status(400).json({ error: 'Invalid content format' });
        }

        // Move the uploaded image to the processed directory
        const newImagePath = path.join(processedDir, req.file.filename);
        fs.rename(imagePath, newImagePath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).json({ error: 'Failed to move processed image' });
            }
        });

        // Save the parsed content as a .json file in the specified format
        const jsonFilename = `${path.basename(newImagePath, path.extname(newImagePath))}-content.json`;
        const jsonFilePath = path.join(processedDir, jsonFilename);

        fs.writeFile(jsonFilePath, JSON.stringify(parsedContent, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                return res.status(500).json({ error: 'Failed to save JSON response' });
            }
            console.log(`Content saved to ${jsonFilePath}`);

            // Send the JSON filename back to the client
            res.json({ jsonFileName: jsonFilename });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/menu-companion`);
});
