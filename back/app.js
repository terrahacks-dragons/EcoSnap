// app.js
document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imgElement = document.getElementById('imagePreview');
        imgElement.src = e.target.result;
        imgElement.style.display = 'block';
    };

    reader.onerror = function() {
        document.getElementById('descriptionText').textContent = 'Error loading image preview.';
    };

    reader.readAsDataURL(file);
});

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const descriptionText = document.getElementById('descriptionText');
    descriptionText.textContent = 'Analyzing...';

    if (fileInput.files.length === 0) {
        descriptionText.textContent = 'Please upload an image.';
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error analyzing image');
        }

        const data = await response.json();
        displayDescription(data);
    } catch (error) {
        console.error('Error:', error);
        descriptionText.textContent = 'An error occurred while processing the image.';
    }
});

function displayDescription(data) {
    const descriptionText = document.getElementById('descriptionText');
    if (data.choices && data.choices.length > 0) {
        const choice = data.choices[0];
        const messageContent = choice.message.content;
        descriptionText.innerHTML = `Description: ${messageContent}`;
    } else {
        descriptionText.textContent = 'No description available.';
    }
}
