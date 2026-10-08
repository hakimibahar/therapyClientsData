// js/pdf-generator.js

async function downloadPDF() {
    
    showLoading();

    try {
        const { pdf, opt } = await generatePDF();

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = opt.filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showNotification("فرم با موفقیت دانلود شد.", "success");

    } catch (err) {
        showNotification("خطا در دانلود pdf", "error");
        console.error(err);

    } finally {
        changeBackInputsToNormall();
        document.body.classList.remove("pdf-mode");
        document.getElementById("pdfPatientName").style.display = "none";
        hideLoading();
    }
}


async function generatePDF() {

    const pdfName = document.getElementById("pdfPatientName");
    pdfName.textContent = document.getElementById("fullName").value;
    pdfName.style.display = "block";

    // convert textareas to text
    document.body.classList.add("pdf-mode");
    
    changeAllInputsToText();

    // pdf

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const element = document.querySelector(".form-container");
    const fullName = document.getElementById("fullName").value.trim() || "";
    const date = document.getElementById("visitDate").value.replace(/\//g, "-");

    
    // persian digits
    convertNumbersToPersian(element);

    // const canvas = await html2canvas(element, {
    //     scale: 1,
    //     useCORS: true,
    //     allowTaint: true
    // });

    const opt = {
        margin: [0.1, 0.1, 0.1, 0.1],
        caption: "فرم توافق نامه درمانی" + "_" + fullName  + "_" + date,
        filename: "form-" + date + ".pdf",
        image: {
            type: "jpeg",
            quality: 0.75
        },
        html2canvas: {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: true
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        },
        pagebreak: {
            mode: ["avoid-all", "css", "legacy"]
        }
    };



    const worker = html2pdf().set(opt).from(element);
    const pdf = await worker.toPdf().get("pdf");
    return {pdf, opt};
}

window.downloadPDF = downloadPDF;
window.generatePDF = generatePDF;