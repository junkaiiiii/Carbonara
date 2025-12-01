const button = document.getElementById("signUpBtn");
const form = document.getElementById("signUpForm");
const messageBox = document.getElementById("messageBox");

button.addEventListener("click",(e)=>{
    e.preventDefault();

    const formData = new FormData(form);
    let data = {};

    formData.forEach((value,key) => {
        data[key] = value;
    });

    console.log(data)

    fetch('api/user_api.php', {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.error) {
                messageBox.style.color = "red";
                messageBox.style.textAlign = 'center';
                messageBox.textContent = result.error; 
                return;
            }

            // ------------------------------
            //   🎉 SHOW SUCCESS
            // ------------------------------
            if (result.success) {
                messageBox.style.color = "green";
                messageBox.style.textAlign = 'center';
                messageBox.textContent = "Account created successfully!";
                // You can redirect after a short delay if you want
                // setTimeout(() => window.location.href = "login.html", 1000);
            }
        })
        .catch (error => console.error("Fetch error:", error));
})