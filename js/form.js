// API URL for the Render deployment
const API_URL = 'https://luz-and-lens-backend.onrender.com';  // Use your backend URL here

// Image preview functionality
document.getElementById('file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Form submission handler with progress indication
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const resultDiv = document.getElementById('result');
    const spinner = document.getElementById('spinner');
    const uploadButton = document.getElementById('uploadButton');
    const formData = new FormData(this);

    try {
        // Show loading state
        spinner.style.display = 'block';
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';
        resultDiv.innerHTML = '';
        resultDiv.className = '';

        // Send the upload request to the backend
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });

        const data = await response.json();

        // Handle successful upload
        if (response.ok) {
            resultDiv.className = 'result success';
            resultDiv.innerHTML = `
                        <h3>✅ Upload Successful!</h3>
                        <p>${data.message}</p>
                        <p><strong>File:</strong> ${data.file.originalName}</p>
                        <p><strong>Size:</strong> ${(data.file.size / 1024).toFixed(2)} KB</p>
                    `;
            // Reset form and preview
            this.reset();
            document.getElementById('preview').style.display = 'none';
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    } catch (error) {
        // Handle error state
        resultDiv.className = 'result error';
        resultDiv.innerHTML = `
                    <h3>❌ Error</h3>
                    <p>${error.message}</p>
                `;
    } finally {
        // Reset UI state
        spinner.style.display = 'none';
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload Image';
    }
});
