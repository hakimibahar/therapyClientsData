// js/app.js

window.addEventListener("DOMContentLoaded", () => {

    const DEBUG = CONFIG.DEBUG;

    if (DEBUG) {
        document.body.classList.add("debug-mode");
    } else {
        document.body.classList.remove("debug-mode");
    }

    document.getElementById("version").textContent = toPersianDigits(CONFIG.VERSION);

    // FIX updateAgreementFields
    document.getElementById("fullName").addEventListener("input", updateAgreementFields);
    document.getElementById("fatherName").addEventListener("input", updateAgreementFields);
    document.getElementById("nationalCode").addEventListener("input", updateAgreementFields);
    document.getElementById("birthdayLocation").addEventListener("input", updateAgreementFields);


    function addFamilyRow() {
        const tbody = document.getElementById("familyTableBody");
        const template = document.getElementById("familyRowTemplate");

        const newRow = template.content.cloneNode(true);

        tbody.appendChild(newRow);
    }

    function removeFamilyRow(button) {
        button.closest("tr").remove();
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
    window.addFamilyRow = addFamilyRow;
    window.removeFamilyRow = removeFamilyRow;
    window.getFamilyMembers = getFamilyMembers;

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

    // SUBMIT FORM
    // send telegram pdf
    // send data to google sheet
    async function submitForm() {
        const data = getFormData();

        if (!validateForm(data)) return;

        showLoading();

        try {
            const sheetResult = await sendDataToGoogleSheet(data);

            if (!sheetResult.success) {
                console.error("Google Sheet failed:", sheetResult.error);
            }

            await submitPdfToTelegram();

            
        } catch (error) {
            showNotification("خطا در ارسال", "error");
            console.error("Submit error:", error);
            
        } finally {
            showNotification("فرم با موفقیت ارسال شد.", "success");
            changeBackInputsToNormall();
            document.body.classList.remove("pdf-mode");
            document.getElementById("pdfPatientName").style.display = "none";
            hideLoading();
        }
    }

    window.submitForm = submitForm;



});