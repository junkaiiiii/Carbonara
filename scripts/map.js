// TAKE NOTE* Leaflet uses (lat, lng) BUT OpenRouteService uses (lon, lat)


// const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU5NDg3N2M5YmFmYTQ1Mjg4YjQ3NzkyNTYwZDM5NGVmIiwiaCI6Im11cm11cjY0In0=";
const ORS_URL = `https://api.openrouteservice.org/v2/directions/driving-car?`;
let orsKey;
let googleKey;
let map;

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
    geoCodeAddress("Kuala Lumpur").then(result => {
        console.log(result);
    });  
    initMap(); 


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
initApp();
let routeLayer, startMarker, endMarker;
async function geoCodeAddress(address) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`
      );

      const data = await response.json();
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
        let resStart = await fetch(`proxy.php?search=${start}`);
        let dataStart = await resStart.json();
        console.log(dataStart);
        if (dataStart.length === 0){
            alert("Location Not Found!");
            return;
        }
        let resEnd = await fetch(`proxy.php?search=${end}`);
        dataEnd = await resEnd.json();
        console.log(dataEnd);
        if (dataEnd.length === 0){
            alert("Location Not Found!");
            return;
        }



        let latStart = parseFloat(dataStart[0].lat);
        let lonStart = parseFloat(dataStart[0].lon);
        let latEnd = parseFloat(dataEnd[0].lat);
        let lonEnd = parseFloat(dataEnd[0].lon);


        // if (marker){
        //     map.removeLayer(marker);
        // }
        map.setView([latStart,lonStart],17)
        getRoute([lonStart, latStart],[lonEnd,latEnd]);

        //     .then(res => res.json())
        //     .then(data=>{ 
        //         console.log(data)
        //         if(data.length ===0){
        //             alert("LOcation not found");
        //             return;
        //         }

        //         let lat = parseFloat(data[0]["lat"]);
        //         let lon = parseFloat(data[0].lon);
                
        //         if (marker){
        //             map.removeLayer(marker);
        //         }

        //         marker = L.marker([lat,lon]).addTo(map);
        //         map.setView([lat,lon],15)
        //     });
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

// let clickCount = 0;
// let startcoords, endcoords;
// //clickable markers
// map.on("click", async function(e){
//     // nominatim api again but the reverse end-point
//     //reverse (from coords to locations)
//     // latlng is a leaflet object
//     // const NOMINATIM_CONFIG = {
//     //     headers: {
//     //         'User-Agent' : 'MyMapApp/1.0',
//     //     }
//     // }

//     let res = await fetch(`proxy.php?reverse=${e.latlng.lat},${e.latlng.lng}`);
//     data = await res.json();
//     if(routeLayer)map.removeLayer(routeLayer);
//     console.log(data)
//     if (clickCount ===0){
//         document.getElementById("start").value = data.display_name;
//         if(startMarker) map.removeLayer(startMarker);
//         startMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
//         startcoords = [e.latlng.lng, e.latlng.lat]
//         clickCount = 1;
//     }
//     else{
//         document.getElementById("end").value = data.display_name;
//         if(endMarker)map.removeLayer(endMarker);
//         endMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
//         endcoords = [e.latlng.lng, e.latlng.lat]
//         clickCount = 0;
//     }
//     if (startMarker && endMarker){
//         console.log(startcoords) ;
//         console.log(endcoords);
//         getRoute(startcoords,endcoords);
//     }
// })

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
        let res =  await fetch(`${ORS_URL}start=${start.join(',')}&end=${end.join(',')}&radiuses=[5000]`,{
            headers: {
                "Authorization" : API_KEY
            }
        });

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
        startMarker = L.marker([start[1], start[0]]).addTo(map);
        endMarker = L.marker([end[1], end[0]]).addTo(map);
        startMarker.bindPopup("Origin").openPopup();
        endMarker.bindPopup("Destination").openPopup();

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
    }
    catch(error){
        console.error(error);
    }
}

// async function autocomplete(inputId, suggestionBoxId) {
//     const input = document.getElementById(inputId);
//     const suggestionBox = document.getElementById(suggestionBoxId);
//     let typingTimer;
//     input.addEventListener("input", ()=> {
//         clearTimeout(typingTimer);
//         typingTimer = setTimeout( 400)
//     })


//     input.addEventListener("input", async function () {
//         clearTimeout(typingTimer);
//         typingTimer = setTimeout(5000);
//         const query = input.value.trim();
//         if (query.length < 2) {
//             suggestionBox.style.display = "none";
//             return;
//         }

//         

//         const res = await fetch(url)

//         const data = await res.json();
//         console.log(data);
//         suggestionBox.innerHTML = "";

//         if (data.length === 0) {
//             suggestionBox.style.display = "none";
//             return;
//         }

//         data.forEach(place => {
//             const div = document.createElement("div");
//             div.textContent = place.display_name;

//             div.addEventListener("click", () => {
//                 input.value = place.display_name; // autofill
//                 suggestionBox.style.display = "none";
//             });

//             suggestionBox.appendChild(div);
//         });

//         suggestionBox.style.display = "block";
//     });

//     // Hide when clicking outside
//     document.addEventListener("click", (e) => {
//         if (!suggestionBox.contains(e.target) && e.target !== input) {
//             suggestionBox.style.display = "none";
//         }
//     });
// }


// autocomplete("start", "start-suggestions");


// getRoute([101.712, 3.1579],[101.7103, 3.1478]);


//broken code
// navigator.geolocation.watchPosition(success, error)

// function success(pos){

    

//     const lat = pos.coords.latitude;
//     const lng = pos.coords.longitude;
//     const accuracy = pos.coords.accuracy;


//     let marker = L.marker([lat, lng]).addTo(map);
//     let circle = L.circle([lat, lng], {radius: accuracy}).addTo(map);

//     marker.bindPopup("FUCK YUOUUUUU").openPopup();

//     map.setView([lat, lng], 15);

// }

// function error(err){
//     if (err.code === 1){
//         alert("Please allow location access");
//     }
//     else{
//         alert(err.code)
//     }
// }