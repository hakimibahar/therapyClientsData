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
            caseNumber: document.getElementById("caseNumber").value,
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
    
     window.submitForm = submitPdfInDriveDownload;
    
    window.addFamilyRow = addFamilyRow;
    window.removeFamilyRow = removeFamilyRow;

    window.downloadPDF = downloadPDF;

    window.updateAgreementFields = updateAgreementFields;
    

    document.getElementById("visitDate").value = getTodayJalali();
    document.getElementById("birthDate").value = getJalaliDateYearsAgo(30);
    
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

        document.getElementById("agreementFullName").textContent = toPersianDigits(fullName) || "....................";
        document.getElementById("agreementFatherName").textContent = toPersianDigits(fatherName) || "....................";
        document.getElementById("agreementNationalId").textContent = toPersianDigits(nationalCode) || "....................";
        document.getElementById("agreementIssuedFrom").textContent = toPersianDigits(issuedFrom) || "....................";
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
            formData.append("pdf", base64);

            const response = await fetch(WEB_APP_URL,{
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.url;
                console.log(result.url);
                showNotification(" فرم با موفقیت آپلود شد.", "success", true);
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

    async function generatePDF() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

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
                scale: isIOS ? 1 : 2,
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


        const pdfName = document.getElementById("pdfPatientName");
        pdfName.textContent = document.getElementById("fullName").value;
        pdfName.style.display = "block";

        // convert textareas to text
        document.body.classList.add("pdf-mode");
        changeAllInputsToText();

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
            p.textContent = toPersianDigits(el.value);
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



});