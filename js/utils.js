// js/utils.js


// loading
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

function toPersianDigits(str) {
    return str.replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
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


async function blobToBase64(blob){
    return new Promise((resolve)=>{
        const reader = new FileReader();
        reader.onloadend = ()=>{
            resolve(reader.result.split(",")[1]);
        };
        reader.readAsDataURL(blob);
    });
}

// Data part


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

function buildSheetPayload(data) {
    const familyMultiLine = formatFamilyMembers(data.familyMembers);
    const registerDate = typeof getTodayJalali === "function" ? getTodayJalali() : "";

    const mapping = [
        { header: "تاریخ ثبت", value: registerDate },
        { header: "تاریخ مراجعه", value: data.visitDate || "" },
        { header: "نام و نام خانوادگی", value: data.fullName || "" },
        { header: "کد ملی", value: "'" + (data.nationalCode || "") },
        { header: "تاریخ تولد", value: data.birthDate || "" },
        { header: "سن", value: data.age || "" },
        { header: "محل تولد", value: data.birthdayLocation || "" },
        { header: "نام پدر", value: data.fatherName || "" },
        { header: "نحوه ارجاع", value: data.referral || "" },
        { header: "شغل", value: data.job || "" },
        { header: "وضعیت تاهل", value: data.maritalStatus || "" },
        { header: "تحصیلات", value: data.education || "" },
        { header: "تلفن", value: "'" + (data.phone || "") },
        { header: "آدرس منزل", value: data.homeAddress || "" },
        { header: "آدرس محل کار", value: data.workAddress || "" },
        { header: "مشکل اصلی", value: data.mainIssue || "" },
        { header: "طول مدت", value: data.duration || "" },
        { header: "درمان قبلی", value: data.pastTherapy || "" },
        { header: "داروها", value: data.medications || "" },
        { header: "بیماری جسمی", value: data.physicalIllness || "" },
        { header: "الگوی خواب", value: data.sleepPattern || "" },
        { header: "سطح انرژی", value: data.energyLevel || "" },
        { header: "اشتها", value: data.appetite || "" },
        { header: "خانواده اصلی", value: data.familyMain || "" },
        { header: "فرزند چندم", value: data.familyPosition || "" },
        { header: "خانواده فعلی", value: data.familyCurrent || "" },
        { header: "رویداد مهم", value: data.familyEvent || "" },
        { header: "رابطه عاطفی", value: data.currentRelationship || "" },
        { header: "اعضای خانواده", value: familyMultiLine }, // سلول چند خطی
        { header: "الکل", value: data.alcohol || "" },
        { header: "سیگار/ویپ", value: data.smoking || "" },
        { header: "مواد مخدر", value: data.drugs || "" },
        { header: "افکار استرس‌زا", value: data.stressThoughts || "" },
        { header: "تجربه ناامیدی", value: data.desperateExperince || "" },
        { header: "رفتار آسیب به خود", value: data.harmselfActs || "" },
        { header: "رفتار پرخطر", value: data.highriskActs || "" }
    ];

    return {
        headers: mapping.map(item => item.header),
        row: mapping.map(item => item.value)
    };
}


function formatFamilyMembers(members) {
    if (!members || !members.length) return "";

    return members
        .filter(m => m.relation || m.age || m.education || m.job || m.illness)
        .map((m, index) => {
            const parts = [];
            if (m.relation) parts.push(`نسبت: ${m.relation}`);
            if (m.age) parts.push(`سن: ${m.age}`);
            if (m.education) parts.push(`تحصیلات: ${m.education}`);
            if (m.job) parts.push(`شغل: ${m.job}`);
            if (m.illness) parts.push(`بیماری: ${m.illness}`);
            
            return `• ${parts.join(" | ")}`;
        })
        .join("\n");
}