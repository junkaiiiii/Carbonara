import { requestRide } from "./app.js";

let html5QrCode;
let isScanning = false;
const generateQr = (roomCode) =>{
    let qrDisplay = document.getElementById('qrPopUp');
    // fetch(`api/qr_api.php?room_code=${roomCode}`)
    //     .then (response => response.json())
    //     .then (data => {
    //         console.log(data);
    //         qrDisplay.innerHTML = `<img class="qr-img" src="${data.qr_image}">`;
    //     })
    //     .catch (error => console.error("Fetch error:", error));
    qrDisplay.innerHTML = `<img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=api/request_api.php?room_code=${roomCode}">`
}

// Start QR Code Scanner
function startScanning() {
    const reader = document.getElementById('qr-reader');
    const startBtn = document.getElementById('start-scan');
    const stopBtn = document.getElementById('stop-scan');
    const resultDiv = document.getElementById('scan-result');

    reader.style.display = 'block';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    resultDiv.innerHTML = '';

    html5QrCode = new Html5Qrcode("qr-reader");
    
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanError
    ).catch(err => {
        resultDiv.innerHTML = `<div class="status error">Camera access denied or not available</div>`;
        stopScanning();
    });

    isScanning = true;
}

// Stop QR Code Scanner
function stopScanning() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            document.getElementById('qr-reader').style.display = 'none';
            document.getElementById('start-scan').style.display = 'flex';
            document.getElementById('stop-scan').style.display = 'none';
            isScanning = false;
        });
    }
}

// Handle successful scan
function onScanSuccess(decodedText, decodedResult) {
    const resultDiv = document.getElementById('scan-result');
    
    // Extract room code from URL
    let roomCode = '';
    try {
        const url = new URL(decodedText,window.location.origin);
        roomCode = url.searchParams.get('room_code');
    } catch (e) {
        roomCode = decodedText;
    }


    requestRide(roomCode,document.getElementById('messageBox'));
    
    // Stop scanning after successful scan
    stopScanning();
}

// Handle scan errors (can be ignored for continuous scanning)
function onScanError(errorMessage) {
    // Ignore common scanning errors
}



document.getElementById('start-scan').addEventListener('click', startScanning);
document.getElementById('stop-scan').addEventListener('click', stopScanning);

export {generateQr};