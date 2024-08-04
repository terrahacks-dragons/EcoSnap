document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const uploadedImage = document.getElementById("uploaded-image");
    const uploadInput = document.getElementById("upload-input");
    const captureBtn = document.getElementById("capture-btn");
    const resetBtn = document.getElementById("reset-btn");
    const flipBtn = document.getElementById("flip-btn");
    const sustainabilityScore = document.getElementById("sustainability-score");
    const mostSustainableItem = document.getElementById("most-sustainable-item");
    const itemCalories = document.getElementById("item-calories");
    const descriptionElement = document.getElementById("description"); // Added to display description

    let currentStream;
    let useFrontCamera = true;

    async function startCamera() {
        try {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: useFrontCamera ? 'user' : { exact: 'environment' }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            currentStream = stream;
            video.srcObject = stream;
            video.classList.add("active");
        } catch (error) {
            console.error('Error accessing the camera: ', error);
            alert('Error accessing the camera: ' + error.message);
        }
    }

    // Handle image upload
    uploadInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block';
            video.classList.remove("active");
            uploadedImage.classList.add("active");
        };

        reader.onerror = function () {
            sustainabilityScore.textContent = 'Error loading image preview.';
        };

        reader.readAsDataURL(file);

        // After previewing, send the file for analysis
        processImage(file);
    });

    // Capture photo from video
    captureBtn.addEventListener("click", () => {
        if (!currentStream) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            const dataUrl = canvas.toDataURL("image/jpeg");
            uploadedImage.src = dataUrl;
            uploadedImage.classList.add("active");
            video.classList.remove("active");

            processImage(blob);
        }, "image/jpeg");
    });

    // Reset to video stream
    resetBtn.addEventListener("click", () => {
        uploadedImage.classList.remove("active");
        video.classList.add("active");
        uploadInput.value = ''; // Clear the file input value
        sustainabilityScore.textContent = '?/5';
        mostSustainableItem.textContent = 'SAMPLE TEXT';
        itemCalories.textContent = 'SAMPLE TEXT';
        descriptionElement.textContent = 'No description available.'; // Added to reset description
    });

    // Flip camera
    flipBtn.addEventListener("click", () => {
        useFrontCamera = !useFrontCamera;
        startCamera();
    });

    // Process image by sending to server
    async function processImage(imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to analyze image');
            }

            const data = await response.json();
            console.log('Received Data:', data); // Debug log

            if (data.error) {
                alert(data.error);
                return;
            }

            // Fetch the JSON file with the result and update the HTML
            const jsonFileName = data.jsonFileName; // Get JSON file name from server response
            const jsonResponse = await fetch(`/processed/${jsonFileName}`);

            if (!jsonResponse.ok) {
                // Do not throw an error or alert here; just log the issue
                console.error('Error fetching JSON data:', await jsonResponse.text());
                return; // Exit the function if fetching JSON fails
            }

            const jsonData = await jsonResponse.json();

            // Directly access and update content from JSON
            const { content } = jsonData;

            const { item_name, calories, score, description } = content;

            // Update the HTML with the parsed data
            mostSustainableItem.textContent = item_name || 'N/A';
            itemCalories.textContent = `Estimated Calories: ${calories || 'N/A'} calories`;
            sustainabilityScore.textContent = score ? `${score}/5` : '3/5';
            descriptionElement.textContent = description || 'No description available.';

        } catch (error) {
            // Log and alert only critical errors
            console.error('Error processing image:', error);
            // alert('Failed to process image');
        }
    }

    startCamera();
});
