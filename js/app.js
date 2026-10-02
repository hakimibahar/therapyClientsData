window.addEventListener("DOMContentLoaded", () => {

    const WEB_APP_URL = CONFIG.WEB_APP_URL;
    const DEBUG = CONFIG.DEBUG;

    if (DEBUG) {
        document.body.classList.add("debug-mode");
    } else {
        document.body.classList.remove("debug-mode");
    }

    document.getElementById("version").textContent = toPersianDigits(CONFIG.VERSION);

    function addFamilyRow() {
        const tbody = document.getElementById("familyTableBody");
        const template = document.getElementById("familyRowTemplate");

        const newRow = template.content.cloneNode(true);

        tbody.appendChild(newRow);
    }

    function removeFamilyRow(button) {
        button.closest("tr").remove();
    }

    function removeFamilyRow(button) {
        button.closest("tr").remove();
    }


    function removeFamilyRow(button) {
        const row = button.closest("tr");
        row.remove();
    }

    // Collect all form data
    function getFormData() {

        return {
            // Basic information
            // caseNumber: document.getElementById("caseNumber").value,
            visitDate: (document.getElementById("visitDate").value || "").replaceAll("/", "."),
            nationalCode: document.getElementById("nationalCode").value,
            fullName: document.getElementById("fullName").value,
            birthDate: (document.getElementById("birthDate").value || "").replaceAll("/", "."),
            age: document.getElementById("age").value,
            birthdayLocation: document.getElementById("birthdayLocation").value,
            referral: document.getElementById("referral").value,
            fatherName: document.getElementById("fatherName").value,
            job: document.getElementById("job").value,
            maritalStatus: document.getElementById("maritalStatus").value,
            education: document.getElementById("education").value,

            // Contact information
            homeAddress: document.getElementById("homeAddress").value,
            workAddress: document.getElementById("workAddress").value,
            phone: document.getElementById("phone").value,

            // Main problem
            mainIssue: document.getElementById("mainIssue").value,
            duration: document.getElementById("duration").value,

            // Medical / treatment history
            pastTherapy: document.getElementById("pastTherapy").value,
            medications: document.getElementById("medications").value,
            physicalIllness: document.getElementById("physicalIllness").value,
            sleepPattern: document.getElementById("sleepPattern").value,
            energyLevel: document.getElementById("energyLevel").value,
            appetite: document.getElementById("appetite").value,

            // Family information
            familyMain: document.getElementById("familyMain").value,
            familyPosition: document.getElementById("familyPosition").value,
            familyCurrent: document.getElementById("familyCurrent").value,
            familyEvent: document.getElementById("familyEvent").value,
            currentRelationship: document.getElementById("currentRelationship").value,

            // Family members table
            familyMembers: getFamilyMembers(),

            // Substance use
            alcohol: document.getElementById("alcohol").value,
            smoking: document.getElementById("smoking").value,
            drugs: document.getElementById("drugs").value,

            // Safety / risk
            stressThoughts: document.getElementById("stressThoughts").value,
            desperateExperince: document.getElementById("desperateExperince").value,
            harmselfActs: document.getElementById("harmselfActs").value,
            highriskActs: document.getElementById("highriskActs").value,

            // Signature
            signature: getSignature()
        };
    }

    function getFamilyMembers() {
        const rows = document.querySelectorAll("#familyTableBody tr");

        return Array.from(rows).map(row => {
            return {
                relation: row.querySelector(".family-relation")?.value || "",
                age: row.querySelector(".family-age")?.value || "",
                education: row.querySelector(".family-education")?.value || "",
                job: row.querySelector(".family-job")?.value || "",
                illness: row.querySelector(".family-illness")?.value || ""
            };
        });
    }

    // Validation
    function validateForm(data) {

        if (!data.fullName) {
            showNotification("لطفاً نام و نام خانوادگی را وارد کنید", "error");
            return false;
        }

        if (!data.nationalCode) {
            showNotification("لطفاً کد ملی را وارد کنید", "error");
            return false;
        }

        if (!data.birthDate) {
            showNotification("لطفاً تاریخ تولد را وارد کنید", "error");
            return false;
        }

        if (!data.birthdayLocation) {
            showNotification("لطفاً محل تولد را وارد کنید", "error");
            return false;
        }

        if (!data.fatherName) {
            showNotification("لطفاً نام پدر را وارد کنید", "error");
            return false;
        }

        if (!data.job) {
            showNotification("لطفاً شغل را وارد کنید", "error");
            return false;
        }

        if (!data.education) {
            showNotification("لطفاً تحصیلات را وارد کنید", "error");
            return false;
        }

        if (!data.phone) {
            showNotification("لطفاً شماره تلفن را وارد کنید", "error");
            return false;
        }

        if (!data.mainIssue) {
            showNotification("لطفاً علت مراجعه را وارد کنید", "error");
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
    
    //  window.submitForm = submitPdfInDriveDownload;
     window.submitForm = submitPdfToTelegram;
    
    window.addFamilyRow = addFamilyRow;
    window.removeFamilyRow = removeFamilyRow;

    window.downloadPDF = downloadPDF;

    window.updateAgreementFields = updateAgreementFields;
    

    // date fields
    document.getElementById("visitDate").value = getTodayJalali();
    document.getElementById("birthDate").value = getJalaliDateYearsAgo(30);

    const birthDateInput = document.getElementById("birthDate");
    const ageInput = document.getElementById("age");

    birthDateInput.addEventListener("input", function () {
        ageInput.value = calculateAge(this.value);
    });

    
    jalaliDatepicker.startWatch({
        separator: "/"
    });


    function showLoading() {
        document.getElementById("loadingOverlay").classList.remove("hidden");
        document.getElementById("submitBtn").disabled = true;
    }

    function hideLoading() {
        document.getElementById("loadingOverlay").classList.add("hidden");
        document.getElementById("submitBtn").disabled = false;
    }

    // update agreement part
    function updateAgreementFields() {
        const fullName = document.getElementById("fullName").value;
        const fatherName = document.getElementById("fatherName").value;
        const nationalCode = document.getElementById("nationalCode").value;
        const issuedFrom = document.getElementById("birthdayLocation").value;

        document.getElementById("agreementFullName").textContent = fullName || "....................";
        document.getElementById("agreementFatherName").textContent = fatherName || "....................";
        document.getElementById("agreementNationalId").textContent = nationalCode || "....................";
        document.getElementById("agreementIssuedFrom").textContent = issuedFrom || "....................";
    }

    document.getElementById("fullName").addEventListener("input", updateAgreementFields);
    document.getElementById("fatherName").addEventListener("input", updateAgreementFields);
    document.getElementById("nationalCode").addEventListener("input", updateAgreementFields);
    document.getElementById("birthdayLocation").addEventListener("input", updateAgreementFields);
    


    // Submit
    async function submitPdfInDriveDownload() {

        const data = getFormData();
        if (!validateForm(data)) return;
        showLoading();

        try {

            const { pdf, opt } = await generatePDF();

            // main command for converting to pdf 
            const blob = pdf.output("blob");
            const base64 = await blobToBase64(blob);

            const formData = new FormData();

            formData.append("filename", opt.filename);
            formData.append("caption", opt.caption);
            
            formData.append("pdf", base64);

            const response = await fetch(WEB_APP_URL,{
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.url;
                console.log(result.url);
                showNotification(" در حال دانلود فرم ...", "success", true);
            } else {
                showNotification("خطا ثبت فرم", "error");
            }


        } catch (err) {
            showNotification(" خطا اتصال", "error");
            console.error(err);
        } finally {
            changeBackInputsToNormall();
            document.body.classList.remove("pdf-mode");
            document.getElementById("pdfPatientName").style.display = "none";
            hideLoading();
        }
    }

    async function blobToBase64(blob){
        return new Promise((resolve)=>{
            const reader = new FileReader();
            reader.onloadend = ()=>{
                resolve(reader.result.split(",")[1]);
            };
            reader.readAsDataURL(blob);
        });

    }

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

    // Submit PDF to Telegram
    async function submitPdfToTelegram() {

        const data = getFormData();
        if (!validateForm(data)) return;

        showLoading();

        try {

            const { pdf, opt } = await generatePDF();
            // Convert PDF to Blob
            const blob = pdf.output("blob");
            // Convert Blob to Base64
            const base64 = await blobToBase64(blob);
            const formData = new FormData();

            formData.append("filename", opt.filename);
            formData.append("caption", opt.caption);

            formData.append("pdf", base64);
            

            const response = await fetch(CONFIG.WEB_APP_URL, {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            console.log("Telegram result:", result);

            if (result.success) {
                showNotification("فرم با موفقیت به تلگرام ارسال شد.", "success", true);
            } else {
                console.error(result.error);
                showNotification("خطا در ارسال فرم به تلگرام", "error" );
            }

        } catch (err) {
            console.error("Telegram upload error:", err);
            showNotification("خطا در اتصال", "error");

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
    
    function toPersianDigits(str) {
        return str.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
    }


   function changeAllInputsToText() {

        document.querySelectorAll("input, textarea").forEach(el => {

            // Save original value
            el.dataset.originalValue = el.value;

            // Save original display
            el.dataset.originalDisplay = el.style.display;

            // Create PDF text element
            const p = document.createElement("p");

            p.className = "pdf-field";
            p.textContent = el.value;
            p.dataset.pdfTemp = "true";

            // Copy important classes
            if (el.classList.contains("family-relation")) {
                p.classList.add("family-relation");
            }
            if (el.classList.contains("family-age")) {
                p.classList.add("family-age");
            }
            if (el.classList.contains("family-education")) {
                p.classList.add("family-education");
            }
            if (el.classList.contains("family-job")) {
                p.classList.add("family-job");
            }
            if (el.classList.contains("family-illness")) {
                p.classList.add("family-illness");
            }

            // Hide original input
            el.style.display = "none";

            // Put PDF text exactly where input was
            el.after(p);
        });

    }

    function changeBackInputsToNormall() {

        // Remove temporary PDF fields
        document.querySelectorAll("[data-pdf-temp='true']")
            .forEach(el => el.remove());


        // Restore original inputs
        document.querySelectorAll("input, textarea").forEach(el => {

            if (el.dataset.originalValue !== undefined) {
                el.value = el.dataset.originalValue;
                delete el.dataset.originalValue;
            }

            if (el.dataset.originalDisplay !== undefined) {
                el.style.display = el.dataset.originalDisplay;
                delete el.dataset.originalDisplay;
            }
        });
    }

    function convertNumbersToPersian(element) {
        const toPersian = text =>
            text.replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

        // Number inputs
        element.querySelectorAll('input[type="number"]').forEach(el => {
            const value = el.value;

            if (value) {
                el.type = "text";
                el.setAttribute("value", toPersian(value));
                el.value = toPersian(value);
            }
        });

        // Other inputs + textareas
        element.querySelectorAll('input:not([type="number"]), textarea').forEach(el => {
            if (el.value) {
                const value = toPersian(el.value);
                el.setAttribute("value", value);
                el.value = value;
            }
        });

        // Normal text such as <span>123</span>
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );

        while (walker.nextNode()) {
            walker.currentNode.nodeValue =
                toPersian(walker.currentNode.nodeValue);
        }
    }



});