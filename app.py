from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

# Ensure static files (JS, CSS, JSON) are served correctly
@app.route('/static/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)


DATA_FILE = "static/data.json"
ITEMS_FILE = "static/items.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"bonuses": []}  # Ensure structure exists

    try:
        with open(DATA_FILE, "r") as file:
            data = json.load(file)
            if "bonuses" not in data:
                data["bonuses"] = []  # Add the key if missing
            return data
    except (FileNotFoundError, json.JSONDecodeError):
        return {"bonuses": []}  # Ensure valid JSON structure

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

def load_items():
    """Load the predefined and custom items from items.json."""
    if not os.path.exists(ITEMS_FILE):
        return {"predefined_items": {}, "custom_items": {}}
    with open(ITEMS_FILE, "r") as f:
        return json.load(f)

def save_items(data):
    """Save items to the items.json file."""
    with open(ITEMS_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/load_inventory", methods=["GET"])
def load_inventory():
    """Returns the list of inventory items."""
    data = load_data()
    return jsonify(data.get("inventory", []))

@app.route("/save_item", methods=["POST"])
def save_item():
    """Adds a new item or updates an existing item in the inventory."""
    data = load_data()
    inventory = data.get("inventory", [])

    request_data = request.json
    item = request_data.get("item")
    index = request_data.get("index")  # None if adding a new item

    if not item:
        return jsonify({"error": "No item data provided"}), 400

    if index is not None and 0 <= index < len(inventory):
        inventory[index] = item  # Update existing item
    else:
        inventory.append(item)  # Add new item

    data["inventory"] = inventory
    save_data(data)
    return jsonify({"success": True})

@app.route("/remove_item", methods=["POST"])
def remove_item():
    """Removes an item from the inventory."""
    data = load_data()
    inventory = data.get("inventory", [])

    request_data = request.json
    index = request_data.get("index")

    if index is None or not (0 <= index < len(inventory)):
        return jsonify({"error": "Invalid index"}), 400

    del inventory[index]
    data["inventory"] = inventory
    save_data(data)
    return jsonify({"success": True})

@app.route("/load_predefined_items", methods=["GET"])
def load_predefined_items():
    """Returns the predefined items list."""
    items = load_items()
    return jsonify(items.get("predefined_items", {}))

@app.route("/save_custom_item", methods=["POST"])
def save_custom_item():
    """Saves a custom item to the custom_items section in items.json."""
    items = load_items()
    custom_items = items.get("custom_items", {})

    request_data = request.json
    item_key = request_data.get("key")  # Unique key for the item
    item_data = request_data.get("item")

    if not item_key or not item_data:
        return jsonify({"error": "Invalid item data"}), 400

    custom_items[item_key] = item_data
    items["custom_items"] = custom_items
    save_items(items)

    return jsonify({"success": True})

@app.route("/remove_custom_item", methods=["POST"])
def remove_custom_item():
    """Removes a custom item from items.json."""
    items = load_items()
    custom_items = items.get("custom_items", {})

    request_data = request.json
    item_key = request_data.get("key")

    if item_key not in custom_items:
        return jsonify({"error": "Item not found"}), 404

    del custom_items[item_key]
    items["custom_items"] = custom_items
    save_items(items)

    return jsonify({"success": True})

@app.route("/save_bonus", methods=["POST"])
def save_bonus():
    data = load_data()
    request_data = request.json
    index = request_data.get("index")
    new_bonus = request_data.get("bonus")

    if not isinstance(data.get("bonuses"), list):
        data["bonuses"] = []

    if index is not None and 0 <= index < len(data["bonuses"]):
        # Update existing bonus
        data["bonuses"][index] = new_bonus
    else:
        # Add new bonus
        data["bonuses"].append(new_bonus)

    save_data(data)
    return jsonify({"success": True})

@app.route("/remove_bonus", methods=["POST"])
def remove_bonus():
    data = load_data()
    index = request.json.get("index")

    if "bonuses" in data and isinstance(data["bonuses"], list):
        if 0 <= index < len(data["bonuses"]):
            del data["bonuses"][index]  # Remove bonus by index
            save_data(data)
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Invalid index"}), 400
    else:
        return jsonify({"error": "Bonuses data structure is missing or incorrect"}), 500

if __name__ == "__main__":
    app.run(debug=True)
