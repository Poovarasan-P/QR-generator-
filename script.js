let qrCode = null; // Stores the QR code instance
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const urlInput = document.getElementById('urlInput');

// Generate QR Code when button is clicked or Enter is pressed
generateBtn.addEventListener('click', generateQRCode);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateQRCode();
});

function generateQRCode() {
    let url = urlInput.value.trim();
    
    // 1. Validate input
    if (!url) {
        showAlert('Please enter a URL', 'error');
        return;
    }
    
    // 2. Ensure URL has http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url; // Auto-add https:// if missing
    }
    
    // 3. Validate URL format
    try {
        new URL(url); // This will throw error if URL is invalid
    } catch (e) {
        showAlert('Please enter a valid URL (e.g., google.com or https://example.com)', 'error');
        return;
    }
    
    // 4. Clear previous QR code
    document.getElementById('qrcode').innerHTML = '';
    
    // 5. Generate new QR code
    qrCode = new QRCode(document.getElementById('qrcode'), {
        text: url, // This ensures the QR contains the proper URL
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // 6. Show download button
    downloadBtn.style.display = 'inline-block';
    showAlert('QR Code generated successfully!', 'success');
}

// Download QR Code
downloadBtn.addEventListener('click', downloadQRCode);

function downloadQRCode() {
    if (!qrCode) {
        showAlert('No QR code to download', 'error');
        return;
    }
    
    const canvas = document.querySelector('#qrcode canvas');
    
    // Fallback for browsers that don't support toDataURL
    if (!canvas.toDataURL) {
        showAlert("Your browser doesn't support automatic downloads. Right-click the QR code to save it.", 'info');
        return;
    }
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    
    // For Firefox and other browsers that might block downloads
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
}

// Show alert messages
function showAlert(message, type) {
    // Remove existing alerts
    const oldAlert = document.querySelector('.alert');
    if (oldAlert) oldAlert.remove();
    
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.querySelector('.container').prepend(alertBox);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => alertBox.remove(), 300);
    }, 3000);
}