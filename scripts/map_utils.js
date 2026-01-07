// TAKE NOTE* Leaflet uses (lat, lng) BUT OpenRouteService uses (lon, lat)


// const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjU5NDg3N2M5YmFmYTQ1Mjg4YjQ3NzkyNTYwZDM5NGVmIiwiaCI6Im11cm11cjY0In0=";
const ORS_URL = `https://api.openrouteservice.org/v2/directions/driving-car?`;

let orsKey;
let googleKey;

async function getGoogleAPI(){
    try{
        let res = await fetch('api/api_test.php')
        let data = await res.json();
        orsKey = data.orsApiKey;
        googleKey = data.geocodeToken;
        return {orsApi:data.orsApiKey,googleApi: data.geocodeToken};
    }
    catch(err){
        console.log("Error fetching API keys:", err);
    }
}

async function initMap(elementId){
    const map = L.map(elementId, {
        center: [3.139, 101.6869], //coords of starting point
        zoom: 13 // zoom level
    });


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map); //add the map inside

    // add Stamen terrain to map. (a type of skin)
    L.tileLayer.provider('Stadia.StamenTerrain').addTo(map); //change skin

    return map;
}

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

async function getRoute(start,end){
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
        const distance = parseFloat(data.features[0].properties.summary.distance /1000).toFixed(2);
        const eta = Math.round(data.features[0].properties.summary.duration /60);
        
        return {
            coordinates : latlngs,
            distance : distance,
            eta : eta,
            route_geojson : data.features[0].geometry
        };
    }
    catch(error){
        console.log(error);
    }
}

async function drawRoute(map, routeData, startCoords, endCoords){
    // Remove existing layers if any
    console.log(map);
    map.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    const routeLayer = L.polyline(routeData.coordinates, {
        color: 'blue',
        weight: 5,
        opacity: 0.7
    }).addTo(map);
    
    //fit to bound    
    map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
    
    // Add markers
    const startMarker = L.marker([startCoords[1], startCoords[0]]).addTo(map);
    const endMarker = L.marker([endCoords[1], endCoords[0]]).addTo(map);
    
    startMarker.bindPopup("Origin");
    endMarker.bindPopup("Destination");

    return {routeLayer, startMarker, endMarker};

}

export {getGoogleAPI};
export {initMap};
export {geoCodeAddress};
export {getRoute};
export {drawRoute};