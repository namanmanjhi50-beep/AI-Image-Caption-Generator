from flask import Flask, render_template, request, jsonify
from model.caption import generate_caption
import os

app = Flask(__name__)

# Upload Folder
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ===========================
# Home Page
# ===========================

@app.route("/")
def home():
    return render_template("index.html")


# ===========================
# Generate Caption
# ===========================

@app.route("/generate", methods=["POST"])
def generate():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded."
        })

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "error": "Please select an image."
        })

    image_path = os.path.join(
        app.config["UPLOAD_FOLDER"],
        image.filename
    )

    image.save(image_path)

    # -------------------------
    # AI Caption
    # -------------------------

    caption = generate_caption(image_path)

    # -------------------------
    # Instagram Caption
    # -------------------------

    instagram_caption = (
        f"📸 {caption.capitalize()} ✨\n\n"
        "Captured with AI 🤖\n\n"
        "#AI #Photography #ImageCaption"
    )

    # -------------------------
    # Simple AI Hashtags
    # -------------------------

    words = caption.lower().split()

    hashtags = []

    for word in words:

        word = word.replace(",", "").replace(".", "")

        if len(word) > 3:
            hashtags.append("#" + word.capitalize())

    hashtags.extend([
        "#AI",
        "#Photography",
        "#ComputerVision"
    ])

    hashtags = list(dict.fromkeys(hashtags))

    # -------------------------
    # Emoji Suggestions
    # -------------------------

    emoji_map = {

        "dog": "🐶",

        "cat": "🐱",

        "bird": "🐦",

        "flower": "🌸",

        "tree": "🌳",

        "mountain": "🏔️",

        "beach": "🏖️",

        "car": "🚗",

        "food": "🍕",

        "pizza": "🍕",

        "person": "🧑",

        "man": "👨",

        "woman": "👩",

        "baby": "👶",

        "sun": "☀️",

        "snow": "❄️",

        "water": "💧",

        "boat": "⛵",

        "phone": "📱",

        "computer": "💻",

        "book": "📚"

    }

    emojis = []

    for word in words:

        if word in emoji_map:
            emojis.append(emoji_map[word])

    if not emojis:
        emojis = ["📸", "🤖", "✨", "❤️"]

    # -------------------------
    # Return JSON
    # -------------------------

    return jsonify({

        "caption": caption,

        "instagram": instagram_caption,

        "hashtags": hashtags,

        "emojis": emojis,

        "filename": image.filename

    })


# ===========================
# Run App
# ===========================

if __name__ == "__main__":
    app.run(debug=True)