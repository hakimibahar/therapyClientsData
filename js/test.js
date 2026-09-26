window.addEventListener("DOMContentLoaded", () => {

    const WEB_APP_URL = CONFIG.WEB_APP_URL;
    const DEBUG = CONFIG.DEBUG;

    
    if (DEBUG) {
        window.fillTestData = fillTestData;
        document.body.classList.add("debug-mode");
    } else {
        document.body.classList.remove("debug-mode");
    }


    function fillTestData() {

        // Example long text
        const textareas = document.querySelectorAll("textarea");
        const inputs = document.querySelectorAll("input");

        const textlong = "این یک متن بسیار طولانی برای تست PDF است که باید زمانی که به انتهای عرض فیلد رسید به خط بعد منتقل شود و نباید به صورت افقی مخفی یا اسکرول شود.";

        textareas.forEach((textarea, index) => {
            textarea.value = textlong;
        });

        inputs.forEach((input, index) => {
            input.value = textlong;
        });

        document.getElementById("fullName").value = "محمد محسن ریحانی";
        document.getElementById("fatherName").value = "حسین";
        document.getElementById("nationalCode").value = "1234567890";
        document.getElementById("birthdayLocation").value = "تهران";
        document.getElementById("visitDate").value = "1405/07/04";
        document.getElementById("age").value = 30;
        document.getElementById("referral").value = "برادر";
        document.getElementById("education").value = "لیسانس";


         // Family table
        const familyRows = [
            {
                relation: "پدر",
                age: "58",
                education: "کارشناسی ارشد",
                job: "مدیر شرکت با سابقه کاری بسیار طولانی",
                illness: "فشار خون بالا، دیابت و مشکلات قلبی"
            },
            {
                relation: "مادر",
                age: "54",
                education: "کارشناسی",
                job: "معلم",
                illness: "ندارد"
            },
            {
                relation: "برادر",
                age: "30",
                education: "کارشناسی مهندسی",
                job: "مهندس نرم‌افزار",
                illness: "ندارد"
            },
            {
                relation: "خواهر",
                age: "26",
                education: "کارشناسی ارشد",
                job: "طراح گرافیک",
                illness: "میگرن"
            },
            {
                relation: "همسر",
                age: "32",
                education: "کارشناسی",
                job: "کارمند",
                illness: "ندارد"
            }
        ];

        const tbody = document.getElementById("familyTableBody");

        // Remove existing rows
        tbody.innerHTML = "";

        familyRows.forEach(member => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <input type="text"
                        class="form-control family-relation"
                        value="${member.relation}">
                </td>

                <td>
                    <input type="number"
                        class="form-control family-age"
                        value="${member.age}">
                </td>

                <td>
                    <input type="text"
                        class="form-control family-education"
                        value="${member.education}">
                </td>

                <td>
                    <input type="text"
                        class="form-control family-job"
                        value="${member.job}">
                </td>

                <td>
                    <input type="text"
                        class="form-control family-illness"
                        value="${member.illness}">
                </td>

                <td>
                    <button type="button"
                            class="btn btn-danger btn-sm btn-remove"
                            onclick="removeFamilyRow(this)">
                        ×
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });


        // Update agreement fields
        updateAgreementFields();
    }


});