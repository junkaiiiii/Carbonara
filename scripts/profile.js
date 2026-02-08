// Handle profile image upload and preview
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const profileDisplay = document.getElementById('profile-display');
    const placeholderSvg = document.getElementById('placeholder-svg');

    imageInput.addEventListener('change', function() {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Handle Placeholder
                if (placeholderSvg) placeholderSvg.style.display = 'none';
                
                // Find or Create the image tag
                let imgTag = document.getElementById('profile-img-real');
                
                if (!imgTag) {
                    imgTag = document.createElement('img');
                    imgTag.id = 'profile-img-real';
                    imgTag.style.width = '100%';
                    imgTag.style.height = '100%';
                    imgTag.style.borderRadius = '50%';
                    imgTag.style.objectFit = 'cover';
                    profileDisplay.appendChild(imgTag);
                }
                
                // Update source to the preview
                imgTag.src = e.target.result;
            }
            reader.readAsDataURL(file);

            // Link to server
            const formData = new FormData();
            formData.append('profile_pic', file);

            fetch('api/upload_profile_image.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Upload successful:', data.path);
                } else {
                    alert('Upload failed: ' + (data.message || data.error));
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
});

// Handle drivers license upload and preview
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('license-file-input');
    const uploadBtn = document.getElementById('upload-license-btn');
    const cardDesc = document.getElementById('card-desc');
    const previewContainer = document.getElementById('license-preview-container');
    const cardTitle = document.getElementById('card-title');
    const previewImg = document.getElementById('license-img');
    const btnText = document.getElementById('btn-text');

    // Handle file selection preview
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate if its image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                // Show preview
                previewImg.src = event.target.result;
                previewContainer.style.display = 'block';

                // Update UI
                btnText.textContent = "Submit for Approval";
                
                // Add a temporary class to show it's ready for upload
                uploadBtn.classList.add('ready-to-submit');
            };
            reader.readAsDataURL(file);
        }
    });

    // Link to API for upload
    uploadBtn.addEventListener('click', async (e) => {
        // If no file is selected yet, let the label handle the click
        if (!fileInput.files[0]) return;

        // If a file IS selected, we intercept the click to perform the upload
        e.preventDefault();

        const formData = new FormData();
        formData.append('license_image', fileInput.files[0]);

        try {
            const response = await fetch('api/upload_license.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Update UI to "Awaiting Approval" state
                cardTitle.textContent = "Under Review";
                cardDesc.innerHTML = "Your license is being reviewed by our admins.";
                uploadBtn.style.display = "none"; // Hide upload button
            } else {
                alert("Upload failed: " + result.message);
                // Reset button
                btnText.textContent = "Submit for Approval";
                uploadBtn.style.pointerEvents = "auto";
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during upload.");
        }
    });
});