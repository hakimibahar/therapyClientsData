function showNotification(message, type = "info", dontRemove = false) {
    const notif = document.createElement("div");
    notif.textContent = message;
    notif.className = "container-notification"
    // Smooth modern colors
    const colors = {
        success: {
            bg: "rgba(35, 160, 88, 0.92)",   // soft green
        },
        error: {
            bg: "rgba(231, 76, 60, 0.92)",    // soft red
        },
        info: {
            bg: "rgba(52, 152, 219, 0.92)",   // soft blue
        },
        warning: {
            bg: "rgba(241, 196, 15, 0.92)",   // soft yellow
            color: "#1a1a1a"
        }
    };

    const style = colors[type] || colors.info;

    notif.style.background = style.bg;
    if (style.color) notif.style.color = style.color;

    document.body.appendChild(notif);

    if (!dontRemove) {
        setTimeout(() => {
            notif.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            notif.style.opacity = "0";
            notif.style.transform = "translateY(10px)";
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }
}

function testNotifications() {
    showNotification("پیام اطلاعات", "info");

    setTimeout(() => {
        showNotification("پیام موفقیت", "success");
    }, 2000);

    setTimeout(() => {
        showNotification("پیام خطا", "error");
    }, 4000);

    setTimeout(() => {
        showNotification("پیام هشدار", "warning");
    }, 6000);
}