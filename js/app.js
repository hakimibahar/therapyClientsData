window.addEventListener("DOMContentLoaded", () => {

    const WEB_APP_URL = CONFIG.WEB_APP_URL;

    document.getElementById("version").textContent = CONFIG.VERSION;

    // Collect all form data
    function getFormData() {
        console.log((document.getElementById("visitDate").value || "").replaceAll("/", "."));
        return {
            visitDate: (document.getElementById("visitDate").value || "").replaceAll("/", "."),
            fullName: document.getElementById("fullName").value,
            age: document.getElementById("age").value,
            job: document.getElementById("job").value,
            maritalStatus: document.getElementById("maritalStatus").value,
            education: document.getElementById("education").value,

            homeAddress: document.getElementById("homeAddress").value,
            workAddress: document.getElementById("workAddress").value,
            phone: document.getElementById("phone").value,

            mainIssue: document.getElementById("mainIssue").value,
            duration: document.getElementById("duration").value,
            
            pastTherapy: document.getElementById("pastTherapy").value,
            medications: document.getElementById("medications").value,        
            physicalIllness: document.getElementById("physicalIllness").value,
            sleepPattern: document.getElementById("sleepPattern").value,
            energyLevel: document.getElementById("energyLevel").value,
            appetite: document.getElementById("appetite").value,

            familyMain: document.getElementById("familyMain").value,
            familyPosition: document.getElementById("familyPosition").value,
            familyCurrent: document.getElementById("familyCurrent").value,
            familyEvent: document.getElementById("familyEvent").value,
            currentRelationship: document.getElementById("currentRelationship").value,

            alcohol: document.getElementById("alcohol").value,
            smoking: document.getElementById("smoking").value,
            drugs: document.getElementById("drugs").value,

            stressThoughts: document.getElementById("stressThoughts").value,
            desperateExperince: document.getElementById("desperateExperince").value,
            harmselfActs: document.getElementById("harmselfActs").value,
            highriskActs: document.getElementById("highriskActs").value,

            signature: getSignature()
        };

    }

    // Validation
    function validateForm(data) {
    if (!data.fullName) {
        showNotification("لطفاً نام و نام خانوادگی را وارد کنید", "error");
        return false;
    }

    if (!data.phone) {
        showNotification("لطفاً شماره تلفن را وارد کنید", "error");
        return false;
    }

    if (signaturePad.isEmpty()) {
        showNotification("لطفاً امضا را وارد کنید", "error");
        return false;
    }

    return true;
    }

    
    // expose functions to HTML
    window.clearSignature = clearSignature;
    window.submitForm = submitForm;
    window.downloadPDF = downloadPDF;
    
    jalaliDatepicker.startWatch({
        separator: "/"
    });

    document.getElementById("visitDate").value = getTodayJalali();

    function showLoading() {
        document.getElementById("loadingOverlay").classList.remove("hidden");
        document.getElementById("submitBtn").disabled = true;
    }

    function hideLoading() {
        document.getElementById("loadingOverlay").classList.add("hidden");
        document.getElementById("submitBtn").disabled = false;
    }

    // Submit
    async function submitForm() {
        const data = getFormData();
        if (!validateForm(data)) return;
        showLoading();

        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        if (!validateForm(data)) return;

        try {
            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: formData,
                keepalive: true
            });

            const result = await response.json();

            if (result.success) {
                showNotification(" فرم با موفقیت ثبت شد.", "success", true);
            } else {
                showNotification("خطا ثبت فرم", "error");
            }

        } catch (err) {
            showNotification(" خطا اتصال", "error");
            console.error(err);
        } finally {
            hideLoading();
        }
    }

    async function downloadPDF() {

        const data = getFormData();
        if (!validateForm(data)) return;

        showLoading();

        try {

            const element = document.querySelector(".form-container");
            const fullName = document.getElementById("fullName").value.trim() || "";
            const date = document.getElementById("visitDate").value.replace(/\//g, "-");

            const opt = {
                margin: [0.1, 0.1, 0.1, 0.1],
                filename: `فرم توافق نامه درمانی - ${fullName} - ${date}.pdf`,
                image: {
                    type: "jpeg",
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
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
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };


            // before converting

            document.querySelectorAll("input").forEach(input => {
                input.value = toPersianDigits(input.value);
            });
            
            document.querySelectorAll("span").forEach(span => {
                span.textContent = toPersianDigits(span.textContent);
            });

            document.body.classList.add("pdf-mode");

            const pdfName = document.getElementById("pdfPatientName");
            pdfName.textContent = document.getElementById("fullName").value;
            pdfName.style.display = "block";

            changeAllInputsToText()

            // main command for converting to pdf 
            // main convert command
            await html2pdf().set(opt).from(element).save();
            
            // after converting

            changeBackInputsToNormall()

            document.body.classList.remove("pdf-mode");

            pdfName.style.display = "none";

        } catch (err) {
            showNotification(" خطا در دانلود pdf", "error");
            console.error(err);
        } finally {
            hideLoading();
        }

    }
    
    function toPersianDigits(str) {
        return str.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
    }

    function changeAllInputsToText() {

        document.querySelectorAll("input, textarea").forEach(el => {
            const span = document.createElement("div");

            span.className = "pdf-value";

            span.textContent = el.value;

            span.style.border = "1px solid #ccc";
            span.style.padding = "8px";
            span.style.minHeight = "38px";
            span.style.whiteSpace = "pre-wrap";

            el.dataset.originalDisplay = el.style.display;

            el.style.display = "none";

            el.after(span);

        });
    }
    function changeBackInputsToNormall() {
        document.querySelectorAll(".pdf-value").forEach(el => el.remove());

        document.querySelectorAll("input, textarea").forEach(el => {
            el.style.display = el.dataset.originalDisplay || "";
        });
    }


});