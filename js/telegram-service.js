// js/telegram-service.js
    
// Submit PDF to Telegram
async function submitPdfToTelegram() {

    const data = getFormData();
    // if (!validateForm(data)) return;
    const { pdf, opt } = await generatePDF();
    // Convert PDF to Blob
    const blob = pdf.output("blob");
    // Convert Blob to Base64
    const base64 = await blobToBase64(blob);
    const formData = new FormData();

    formData.append("filename", opt.filename);
    formData.append("caption", opt.caption);

    formData.append("pdf", base64);
    

    const response = await fetch(CONFIG.WEB_APP_URL_TELEGRAM, {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    return result;
}
