const getHostedRides = () => {
    fetch("api/ride_api.php?mode=hosted")
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error("Fetch error:", error));
};

getHostedRides();