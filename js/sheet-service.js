// js/sheet-service.js

async function sendDataToGoogleSheet(formData) {
    if (!CONFIG.WEB_APP_URL_SHEET) {
        console.warn("URL گوگل شیت تنظیم نشده است.");
        return { success: false, error: "Sheet URL not defined" };
    }

    const payload = buildSheetPayload(formData);

    const postData = new FormData();
    postData.append("payload", JSON.stringify(payload));

    try {
        const response = await fetch(CONFIG.WEB_APP_URL_SHEET, {
            method: "POST",
            body: postData
        });
        return await response.json();
    } catch (err) {
        console.error("Sheet API Error:", err);
        return { success: false, error: err.message };
    }
}