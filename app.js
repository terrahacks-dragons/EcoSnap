document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const uploadedImage = document.getElementById("uploaded-image");
    const uploadInput = document.getElementById("upload-input");
    const captureBtn = document.getElementById("capture-btn");
    const resetBtn = document.getElementById("reset-btn");
    const flipBtn = document.getElementById("flip-btn");
    const sustainabilityScore = document.querySelector(".u-text-2"); // Class or ID to be updated as needed
    const sustainableAlternatives = document.querySelector(".u-text-4"); // Ensure this matches your HTML ID or class
    const mostSustainableItem = document.querySelector(".u-text-4"); // Ensure this matches your HTML ID or class
    const itemCalories = document.querySelector(".u-text-4"); // Ensure this matches your HTML ID or class
    const descriptionElement = document.querySelector(".u-text-4"); // Ensure this matches your HTML ID or class

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

        processImage(file);
    });

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

    resetBtn.addEventListener("click", () => {
        uploadedImage.classList.remove("active");
        video.classList.add("active");
        uploadInput.value = ''; // Clear the file input value
        sustainabilityScore.textContent = '?/5';
        sustainableAlternatives.textContent = 'No alternatives available';
        mostSustainableItem.textContent = 'SAMPLE TEXT';
        itemCalories.textContent = 'SAMPLE TEXT';
        descriptionElement.textContent = 'No description available.';
    });

    flipBtn.addEventListener("click", () => {
        useFrontCamera = !useFrontCamera;
        startCamera();
    });

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
            console.log('Received Data:', data);

            if (data.error) {
                alert(data.error);
                return;
            }

            const jsonFileName = data.jsonFileName;
            const jsonResponse = await fetch(`/processed/${jsonFileName}`);

            if (!jsonResponse.ok) {
                console.error('Error fetching JSON data:', await jsonResponse.text());
                return;
            }

            const jsonData = await jsonResponse.json();
            const { content } = jsonData;
            const { sustainable_alternatives } = content;

            // Update the HTML element for sustainable alternatives
            if (sustainable_alternatives && Array.isArray(sustainable_alternatives)) {
                sustainableAlternatives.textContent = sustainable_alternatives.join(', ');
            } else {
                sustainableAlternatives.textContent = 'No alternatives available';
            }

            sustainabilityScore.textContent = `3/5`;


        } catch (error) {
            console.error('Error processing image:', error);
        }
    }

    startCamera();
});
