// Handle Profile Image Upload and Preview
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const profileDisplay = document.getElementById('profile-display');
    const placeholderSvg = document.getElementById('placeholder-svg');

    imageInput.addEventListener('change', function() {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Remove the default icon
                if (placeholderSvg) placeholderSvg.style.display = 'none';
                
                // set chosen image as background
                profileDisplay.style.backgroundImage = `url(${e.target.result})`;
                profileDisplay.style.backgroundSize = 'cover';
                profileDisplay.style.backgroundPosition = 'center';
            }
            reader.readAsDataURL(file);

            // link to server
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
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});

// Handle Driver's License Upload and Preview
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('license-file-input');
    const uploadBtn = document.getElementById('upload-license-btn');
    const cardDesc = document.getElementById('card-desc');
    const previewContainer = document.getElementById('license-preview-container');
    const cardTitle = document.getElementById('card-title');
    const previewImg = document.getElementById('license-img');
    const btnText = document.getElementById('btn-text');

    // 1. Handle File Selection and UI Preview
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate it's an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                // Show the preview
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

    // 2. Handle the Actual Upload to the API
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