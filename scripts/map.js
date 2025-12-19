// TAKE NOTE* Leaflet uses (lat, lng) BUT OpenRouteService uses (lon, lat)


// const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU5NDg3N2M5YmFmYTQ1Mjg4YjQ3NzkyNTYwZDM5NGVmIiwiaCI6Im11cm11cjY0In0=";
const ORS_URL = `https://api.openrouteservice.org/v2/directions/driving-car?`;
let orsKey;
let googleKey;
let map;
let startMarkerChose = false;
let endMarkerChose = false;
let states = {
    vehicles : [],
    rides : [],
}
let selectedVehicleId = null;

async function getGoogleAPI(){
    try{
        let res = await fetch('api/api_test.php')
        let data = await res.json();
        return {orsApi:data.orsApiKey,googleApi: data.geocodeToken};
    }
    catch(err){
        console.log("Error fetching API keys:", err);
    }
}
// getGoogleAPI();
async function initApp(){
    const keys = await getGoogleAPI();
    orsKey = keys.orsApi;
    googleKey = keys.googleApi;
    initMap(); 
    setupEventListeners();
    
    getVehicles();
    setupCreateRideButton();
    
}

// initialize the map on the "map" div with a given center and zoom

async function initMap(){
    map = L.map('map', {
        center: [3.139, 101.6869], //coords of starting point
        zoom: 13 // zoom level
    });


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map); //add the map inside

    // add Stamen terrain to map. (a type of skin)
    L.tileLayer.provider('Stadia.StamenTerrain').addTo(map); //change skin
}


// let marker = L.marker([3.139, 101.6869]).addTo(map);
// let circle = L.circle([3.139, 101.6869], {radius: 50}).addTo(map);
// marker.bindPopup("FUCK YUOUUUUU").openPopup();

let routeLayer, startMarker, endMarker;
async function geoCodeAddress(address) {
    try {
        console.log(googleKey);
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`
        );

        const data = await response.json();
        console.log(data);
        // console.log("Full API response:", data); 
        // console.log("Status:", data.status);  
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            console.log(result);
            const { lat, lng } = result.geometry.location;
        
            // Extract city, state from address components
            const addressComponents = result.address_components;
            let geocodeCity = '';
            let state = '';
            
            addressComponents.forEach((component) => {
                if (component.types.includes('locality')) {
                    geocodeCity = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }
            });
            
            // Create clean address format
            const formattedAddress = geocodeCity && state ? `${geocodeCity}, ${state}` : result.formatted_address;
            
            return { 
                lat, 
                lng,
                formattedAddress
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}


async function submitForm(event){
    event.preventDefault();
    console.log("form submitted");
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    console.log(start);
    console.log(end);
    if(!start || !end) return alert("Enter a proper location please!");
    //nominatim api
    try{
        let resStart = await geoCodeAddress(start);
        // let dataStart = await resStart.json();
        console.log(resStart);
        if (resStart.length === 0){
            alert("Location Not Found!");
            return;
        }
        let resEnd = await geoCodeAddress(end);
        // dataEnd = await resEnd.json();
        console.log(resEnd);
        if (resEnd.length === 0){
            alert("Location Not Found!");
            return;
        }



        let latStart = parseFloat(resStart.lat);
        let lonStart = parseFloat(resStart.lng);
        let latEnd = parseFloat(resEnd.lat);
        let lonEnd = parseFloat(resEnd.lng);

        map.setView([latStart,lonStart],17)
        getRoute([lonStart, latStart],[lonEnd,latEnd]);
    }
    catch(err){
        console.error(`Error fetching location: ${err}`)
    }
    

}

const form = document.getElementById("form");


form.addEventListener("submit", submitForm);
form.addEventListener("reset", clearRoute);

if(!navigator.geolocation){
    console.log("Your device does not support geolocation feature")
}
else{
    console.log("It works");
    navigator.geolocation.getCurrentPosition(getPosition);
}
function getPosition(pos){
    console.log(pos);

    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    let accuracy = pos.coords.accuracy;
    L.circle([lat, lon], {radius: accuracy}).addTo(map);
    L.marker([lat,lon]).addTo(map);
    map.setView([lat,lon],15);
}

async function setupEventListeners(){
    let clickCount = 0;
    let startcoords, endcoords;
    //clickable markers
    map.on("click", async function(e){
        // nominatim api again but the reverse end-point
        //reverse (from coords to locations)
        // latlng is a leaflet object
        // const NOMINATIM_CONFIG = {
        //     headers: {
        //         'User-Agent' : 'MyMapApp/1.0',
        //     }
        // }

        let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latlng.lat},${e.latlng.lng}&key=${googleKey}`);
        data = await res.json();
        if(routeLayer)map.removeLayer(routeLayer);
        console.log(data)
        if (!startMarker && !endMarker)return;
        if (startMarkerChose){
            // document.getElementById("start").value = data.display_name;
            if(startMarker) map.removeLayer(startMarker);
            startMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            startcoords = [e.latlng.lng, e.latlng.lat]
            endcoords = [endMarker.getLatLng().lng, endMarker.getLatLng().lat];
        }
        else{
            // document.getElementById("end").value = data.display_name;
            if(endMarker)map.removeLayer(endMarker);
            endMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            endcoords = [e.latlng.lng, e.latlng.lat]
            startcoords = [startMarker.getLatLng().lng, startMarker.getLatLng().lat];
        }
        if (startMarker && endMarker){
            console.log(startcoords) ;
            console.log(endcoords);
            getRoute(startcoords,endcoords);
        }
    })


}



function clearRoute() {
    if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
    }
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }

    startcoords = null;
    endcoords = null;
    clickCount = 0;   // Reset click tracking

    document.getElementById("start").value = "";
    document.getElementById("end").value = "";

    document.getElementById("distance").textContent = "Distance";
    document.getElementById("eta").textContent = "ETA";
}

async function getRoute(start,end){
    //let info = document.getElementById("info");
    try{
        console.log(orsKey);
        let res =  await fetch(`${ORS_URL}start=${start.join(',')}&end=${end.join(',')}&radiuses=[5000]`,{
            headers: {
                "Authorization" : orsKey
            }
        });
        console.log(res);   
        const data = await res.json();
        console.log(data);

        //Extract route coordinates
        if (data.error) {
            console.error(data.error.message);
            alert(`Routing Error: ${data.error.message}`);
            return;
        }

        if (!data.features || data.features.length === 0) {
            alert("Route not found.");
            return;
        }
        const coordinates = data.features[0].geometry.coordinates; //access the json() file and returns the coordinates of journey
        const latlngs = coordinates.map(coord => [coord[1], coord[0]]);

        console.log(coordinates);
        if(routeLayer)map.removeLayer(routeLayer);

        routeLayer = L.polyline(latlngs, {
            color: 'blue',
            weight: 5,
            opacity: 0.7
        }).addTo(map);

        //fit map to bound
        map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
        
        if (startMarker) map.removeLayer(startMarker);
        if (endMarker) map.removeLayer(endMarker);
        startMarker = L.marker([start[1], start[0]], { draggable : true }).addTo(map);
        endMarker = L.marker([end[1], end[0]], { draggable : true }).addTo(map);
        startMarker.bindPopup("Origin").openPopup();
        endMarker.bindPopup("Destination").openPopup();
        startMarker.on("click", () => {
            startMarkerChose = true;
            endMarkerChose = false;
        })
        endMarker.on("click", () => {
            endMarkerChose = true;
            startMarkerChose = false;
        })


        const distance = parseFloat(data.features[0].properties.summary.distance /1000).toFixed(2);
        const eta = Math.round(data.features[0].properties.summary.duration /60);
        console.log(distance + 'km', eta + 'minutes');
        document.getElementById("distance").textContent = `Distance: ${distance} km`;
        document.getElementById("eta").textContent = `ETA: ${eta} minutes`
        // info.innerHTML = `
        // <div class='info'>
        //     <strong>Route Found!</strong><br>
        //     Distance: ${distance} km | ETA: ${eta} minutes
        // </div>`;
        states.rides = {
            origin_text : document.getElementById("start").value,
            origin_lat : start[1],
            origin_lng : start[0],
            destination_text : document.getElementById("end").value,
            destination_lat : end[1],
            destination_lng : end[0],
            route_geojson : data.features[0].geometry,
            distance : distance,
            eta : eta
        }
    }
    catch(error){
        console.error(error);
    }
}

async function handleCreateRide() {
    try {
        console.log("Inside handleCreateRide function");
        console.log("Current states.rides:", states.rides);
        console.log(states.vehicles);
        // 1. Validate route exists
        if (!states.rides || !states.rides.origin_lat) {
            alert("Please search for a route on the map first!");
            return;
        }

        // 2. Validate Vehicle Selection
        if (!selectedVehicleId) {
            alert("Please select a vehicle from the dropdown!");
            return;
        }

        const seats = document.getElementById("seatsInput").value;
        const departure = document.getElementById("departureInput").value;

        if (!seats || !departure) {
            alert("Please fill in the number of seats and departure time.");
            return;
        }

        // REMINDER JENSEN U NEED THE OBJECT *FIND* THE VEHICLE FROM THE ID OR THE NUMBER PLATE
        console.log("Selected Vehicle ID:", selectedVehicleId);
        const selectedVehicle = states.vehicles.find(vehicle => vehicle.vehicle_id === selectedVehicleId);
        
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Format as YYYY-MM-DD HH:MM:SS
        const formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formatted);
        const rideData = {
            driver_id: selectedVehicle.driver_id,
            vehicle_id: selectedVehicleId,
            origin_text: states.rides.origin_text,
            origin_lat: states.rides.origin_lat,
            origin_lon: states.rides.origin_lng,
            destination_text: states.rides.destination_text,
            destination_lat: states.rides.destination_lat,
            destination_lon: states.rides.destination_lng,
            route_geojson: states.rides.route_geojson,
            departure_datetime: departure,
            available_seats: seats,
        };

        console.log(rideData);
        const response = await fetch('api/ride_api.php', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rideData)
        });
        // console.log(response.json());
        const result = await response.json();
        console.log("SERVER RESPONSE:", result);
        // if (response.ok) {
        //     alert("Ride Created Successfully!");
        //     window.location.reload(); 
        // } else {
        //     alert("Error: " + (result.error || "Unknown error"));
        // }

        // console.log("Payload being sent:", rideData);

        // // 5. POST to API
        // const response = await fetch('api/ride_api.php', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(rideData)
        // });

        // const result = await response.json();
        // if (response.ok) {
        //     alert("Ride Created Successfully!");
        //     window.location.reload(); 
        // } else {
        //     alert("Error: " + (result.error || "Unknown error"));
        // }

    } catch (error) {
        console.error("Critical error in handleCreateRide:", error);
    }
}

function getVehicles(){
    fetch("api/vehicle_api.php")
        .then(res => res.json())
        .then(data => {
            states.vehicles = [];

            data.forEach(vehicle => {
                states.vehicles.push(vehicle);
                
            })
            console.log(states.vehicles);
            render();
            const selected = document.querySelector(".rideInfoBlock");
            const optionsContainer = document.querySelector(".vehicle-options");
            const selectedText= document.querySelector(".selected-text");
            
            selected.addEventListener("click", () => {
                vehicleOptions.style.display = vehicleOptions.style.display === "block" ? "none" : "block";
            });

            document.querySelectorAll(".vehicle-options div").forEach(option => {
                option.addEventListener("click", () => {
                    console.log(option.textContent);
                    selectedVehicleId = option.getAttribute("data-id");
                    selectedText.textContent = option.textContent;

                });
                vehicleOptions.style.display = "none";
            });
        });
    


}
const vehicleOptions = document.querySelector(".vehicle-options");
const fillVehicles = (vehicle) => {
    
    const div = document.createElement("div");
    div.innerHTML = `
        <div data-id='${vehicle.vehicle_id}'>${vehicle.car_plate_number}</div>
    `
    return div.firstElementChild;
}

function render(){
    vehicleOptions.innerHTML = "";
    states.vehicles.forEach(vehicle => {
        const vehicleDiv = fillVehicles(vehicle);
        vehicleOptions.appendChild(vehicleDiv);
    });

}

function setupCreateRideButton() {
    const createRideBtn = document.querySelector(".infoContainer button");
    
    if (createRideBtn) {
        createRideBtn.addEventListener("click", handleCreateRide);
    } else {
        console.error("error");
    }
}

initApp();
