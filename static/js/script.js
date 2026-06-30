// ==========================================
// AI Caption Studio
// script.js (Part 1)
// ==========================================

// ---------- DOM Elements ----------

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const generateBtn = document.getElementById("generateBtn");

const caption = document.getElementById("caption");
const instagramCaption = document.getElementById("instagramCaption");

const hashtags = document.getElementById("hashtags");
const emojis = document.getElementById("emojis");

const loading = document.getElementById("loading");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const status = document.getElementById("status");

const uploadArea = document.querySelector(".upload-area");

let selectedFile = null;

// ==========================================
// Upload Image Preview
// ==========================================

imageInput.addEventListener("change", function () {

    if (!this.files.length) return;

    selectedFile = this.files[0];

    previewImage.src = URL.createObjectURL(selectedFile);

    previewImage.style.display = "block";

    fileName.innerText = selectedFile.name;

    fileSize.innerText =
        (selectedFile.size / 1024 / 1024).toFixed(2) + " MB";

    status.innerText = "Image Loaded";

});

// ==========================================
// Drag & Drop Upload
// ==========================================

uploadArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    uploadArea.classList.add("dragover");

});

uploadArea.addEventListener("dragleave", () => {

    uploadArea.classList.remove("dragover");

});

uploadArea.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadArea.classList.remove("dragover");

    if (!e.dataTransfer.files.length) return;

    selectedFile = e.dataTransfer.files[0];

    imageInput.files = e.dataTransfer.files;

    previewImage.src = URL.createObjectURL(selectedFile);

    previewImage.style.display = "block";

    fileName.innerText = selectedFile.name;

    fileSize.innerText =
        (selectedFile.size / 1024 / 1024).toFixed(2) + " MB";

    status.innerText = "Image Loaded";

});

// ==========================================
// Generate Caption
// ==========================================

generateBtn.addEventListener("click", async () => {

    if (!selectedFile) {

        showToast("Please upload an image first.");

        return;

    }

    loading.classList.remove("hidden");

    caption.innerHTML = "🧠 AI is analyzing the image...";

    instagramCaption.innerHTML = "";

    hashtags.innerHTML = "";

    emojis.innerHTML = "";

    status.innerText = "Generating...";

    const formData = new FormData();

    formData.append("image", selectedFile);

    try {

        const response = await fetch("/generate", {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        loading.classList.add("hidden");

        if (data.error) {

            caption.innerHTML = data.error;

            status.innerText = "Error";

            return;

        }

        caption.innerHTML = "🤖 " + data.caption;

        instagramCaption.innerHTML = data.instagram;

        // ---------- Demo Hashtags ----------
        const tags = [

            "#AI",
            "#Photography",
            "#Nature",
            "#ImageCaption",
            "#MachineLearning",
            "#ComputerVision"

        ];

        hashtags.innerHTML = "";

        tags.forEach(tag => {

            hashtags.innerHTML +=
                `<span>${tag}</span>`;

        });

        // ---------- Emoji Suggestions ----------

        emojis.innerHTML =
            "📸 🤖 ✨ 🌍 ❤️";

        status.innerText = "Completed";

        showToast("Caption Generated!");

    }

    catch (error) {

        loading.classList.add("hidden");

        caption.innerHTML =
            "❌ Something went wrong.";

        status.innerText = "Server Error";

        console.error(error);

        showToast("Server Error");

    }

});

// ==========================================
// Copy Caption
// ==========================================

const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", () => {

    const text =
        "AI Caption:\n\n" +
        caption.innerText +
        "\n\nInstagram Caption:\n\n" +
        instagramCaption.innerText;

    navigator.clipboard.writeText(text);

    showToast("📋 Caption Copied!");

});

// ==========================================
// Download Caption
// ==========================================

const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {

    const text =

        `AI Caption

${caption.innerText}

---------------------------------------

Instagram Caption

${instagramCaption.innerText}

---------------------------------------

Generated by AI Caption Studio`;

    const blob = new Blob([text], {
        type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "AI_Caption.txt";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast("📥 Download Started!");

});

// ==========================================
// Clear Button
// ==========================================

const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {

    imageInput.value = "";

    selectedFile = null;

    previewImage.src = "";

    previewImage.style.display = "none";

    caption.innerHTML =
        "Upload an image to generate a caption.";

    instagramCaption.innerHTML =
        "Instagram caption will appear here.";

    hashtags.innerHTML =
        "#AI #Photography #Nature";

    emojis.innerHTML =
        "🤖 📷 ✨ ❤️";

    fileName.innerText = "-";

    fileSize.innerText = "-";

    status.innerText = "Ready";

    showToast("🗑️ Cleared");

});

// ==========================================
// Dark Mode Toggle
// ==========================================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        themeToggle.innerHTML = "☀️";

        showToast("Light Mode Enabled");

    } else {

        themeToggle.innerHTML = "🌙";

        showToast("Dark Mode Enabled");

    }

});

// ==========================================
// Toast Notification
// ==========================================

const toast = document.getElementById("toast");

function showToast(message) {

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// ==========================================
// Keyboard Shortcut
// Ctrl/Cmd + Enter
// ==========================================

document.addEventListener("keydown", (e) => {

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {

        if (selectedFile) {

            generateBtn.click();

        }

    }

});

// ==========================================
// Welcome Toast
// ==========================================

window.addEventListener("load", () => {

    setTimeout(() => {

        showToast("🤖 Welcome to AI Caption Studio");

    }, 700);

});