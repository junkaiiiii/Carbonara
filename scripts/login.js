const button = document.getElementById('logInBtn');
const form = document.getElementById('logInForm');


button.addEventListener('click',(e)=>{
    e.preventDefault();

    const formData = new FormData(form);
    let data = {};

    formData.forEach((value,key) => {
        data[key] = value;
    });

    console.log(data)

    fetch("api/login_api.php", {
        method: "POST",
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
        //   SHOW SUCCESS
        // ------------------------------
        if (result.success) {
            messageBox.style.color = "green";
            messageBox.style.textAlign = 'center';
            messageBox.textContent = "Logged In successfully! Redirecting to user's dashboard";

            setTimeout(()=>{

                if (result.role === "Admin"){
                    window.location.href = 'admin_overview.php';
                } else {
                    window.location.href = 'find_rides.php';
                }
                

            },500);
        }
    })
    .catch(error => console.error("Fetch error:", error));

})