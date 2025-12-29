import { createImpactStats, createDriverMenu } from "./app.js";

let states = {
    co2: null,
    session: null
};

const impactSection = document.getElementById("impact-section");
const driverMenuSection = document.getElementById("driver-menu-section");

// Fetch functions - now properly return promises
const fetchTotalCo2 = () => {
    return fetch("api/co2_api.php?mode=total")
        .then(response => response.json())
        .then(weight => {
            states.co2 = weight;
            console.log("CO2 fetched:", weight);
        })
        .catch(error => {
            console.error("Error fetching CO2:", error);
        });
}

const fetchSession = () => {
    return fetch('api/session_api.php?mode=general')
        .then(response => response.json())
        .then(data => {
            states.session = data;
            console.log("Session fetched:", data);
        })
        .catch(error => {
            console.error("Error fetching session:", error);
        });
}

const renderImpact = () => {
    console.log("Rendering impact, co2 value:", states.co2);
    impactSection.innerHTML = "";

    if (states.co2 === null) {
        console.log("CO2 is null, skipping render");
        return;
    }

    const impactContainer = createImpactStats(states.co2);
    impactSection.appendChild(impactContainer);
    console.log("Impact rendered successfully");
};

const renderDriverMenu = () => {
    console.log("Rendering driver menu, session:", states.session);
    driverMenuSection.innerHTML = "";

    if (!states.session) {
        console.log("Session is null, skipping render");
        return;
    }

    if (states.session.role === "Driver") {
        const driverMenu = createDriverMenu();
        driverMenuSection.appendChild(driverMenu);
        console.log("Driver menu rendered successfully");
    } else {
        console.log("User is not a driver, role:", states.session.role);
    }
};

const init = async () => {
    console.log("Initializing...");
    
    await Promise.all([
        fetchTotalCo2(),
        fetchSession(),
    ]);

    console.log("All data fetched, states:", states);
    
    renderImpact();
    renderDriverMenu();
};

init();