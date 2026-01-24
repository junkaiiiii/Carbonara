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