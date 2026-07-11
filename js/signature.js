window.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("signaturePad");
    const signaturePad = new SignaturePad(canvas);

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = 180 * ratio;

        canvas.getContext("2d").scale(ratio, ratio);
        signaturePad.clear();
    }

    window.addEventListener("load", resizeCanvas);
    window.addEventListener("resize", resizeCanvas);

    function clearSignature() {
        signaturePad.clear();
    }

    function getSignature() {
        return signaturePad.isEmpty()
            ? null
            : signaturePad.toDataURL();
    }

    window.clearSignature = clearSignature;
    window.getSignature = getSignature;
    window.signaturePad = signaturePad;

});