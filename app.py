from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test", methods=["GET"])
def test_route():
    """A simple test route to verify the server is working."""
    return jsonify({"status": "ok", "message": "Server is running"})

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
    
    # Initialize custom_items if it doesn't exist
    if "custom_items" not in items:
        items["custom_items"] = {}
    
    custom_items = items["custom_items"]

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

# Add a route to check all registered routes
@app.route('/debug/routes', methods=['GET'])
def debug_routes():
    """Returns all registered routes for debugging."""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': [method for method in rule.methods if method != 'OPTIONS' and method != 'HEAD'],
            'path': str(rule)
        })
    return jsonify(routes)


@app.route('/toggle_condition', methods=['POST'])
def toggle_condition():
    data = request.json
    condition_name = data.get('condition')
    condition_type = data.get('type')
    is_active = data.get('active')

    character_data = load_data()

    # Initialize conditions structure if it doesn't exist
    if 'conditions' not in character_data:
        character_data['conditions'] = {
            'active': [],
            'resistances': [],
            'immunities': [],
            'vulnerabilities': []
        }

    # Ensure all condition lists exist
    for key in ['active', 'resistances', 'immunities', 'vulnerabilities']:
        if key not in character_data['conditions']:
            character_data['conditions'][key] = []

    # Update the condition
    condition_list = character_data['conditions'][condition_type]

    if is_active and condition_name not in condition_list:
        condition_list.append(condition_name)
    elif not is_active and condition_name in condition_list:
        condition_list.remove(condition_name)

    # Handle special cases for damage types
    # If something is immune, it can't be resistant or vulnerable
    if condition_type == 'immunity' and is_active:
        if condition_name in character_data['conditions']['resistances']:
            character_data['conditions']['resistances'].remove(condition_name)
        if condition_name in character_data['conditions']['vulnerabilities']:
            character_data['conditions']['vulnerabilities'].remove(condition_name)

    # If something is resistant, it can't be vulnerable
    if condition_type == 'resistance' and is_active:
        if condition_name in character_data['conditions']['vulnerabilities']:
            character_data['conditions']['vulnerabilities'].remove(condition_name)

    # If something is vulnerable, it can't be resistant
    if condition_type == 'vulnerability' and is_active:
        if condition_name in character_data['conditions']['resistances']:
            character_data['conditions']['resistances'].remove(condition_name)

    save_data(character_data)

    # Return the updated conditions for UI updates
    return jsonify({
        'updated': True,
        'conditions': character_data['conditions']
    })


@app.route('/toggle_equipped', methods=['POST'])
def toggle_equipped():
    data = request.json
    item_type = data.get('type')
    item_name = data.get('name')
    is_equipped = data.get('equipped')
    item_data = data.get('item_data', {})

    character_data = load_data()

    # Initialize equipped if it doesn't exist
    if 'equipped' not in character_data:
        character_data['equipped'] = {
            "weapon": "",
            "offhand": "",  # For dual wielding or shield
            "armor": "",
            "shield": "",
            "head": "",
            "neck": "",
            "shoulders": "",
            "chest": "",
            "back": "",
            "wrists": "",
            "hands": "",
            "waist": "",
            "legs": "",
            "feet": "",
            "finger": ""
        }

    # Initialize equipment_data if it doesn't exist
    if 'equipment_data' not in character_data:
        character_data['equipment_data'] = {}

    # Handle equipping/unequipping
    if is_equipped:
        # Special handling for weapons with the Light property
        if item_type == "weapon":
            is_light = item_data.get('isLight', False)

            # If main hand is empty, equip there
            if not character_data['equipped']['weapon']:
                character_data['equipped']['weapon'] = item_name
            # If main hand is full but item is Light and offhand is empty, equip to offhand
            elif is_light and not character_data['equipped']['offhand']:
                character_data['equipped']['offhand'] = item_name
            # Otherwise replace main hand
            else:
                character_data['equipped']['weapon'] = item_name
                # If replacing main hand and it's not Light, clear offhand
                if not is_light:
                    character_data['equipped']['offhand'] = ""

        # Special handling for shields (can't dual wield with shield)
        elif item_type == "shield":
            character_data['equipped']['shield'] = item_name
            # Can't have offhand weapon with shield
            character_data['equipped']['offhand'] = ""

        # For all other equipment types, only one item can be equipped per slot
        else:
            character_data['equipped'][item_type] = item_name

        # Store the item's data for reference
        character_data['equipment_data'][item_name] = {
            'type': item_type,
            'category': item_data.get('category', ''),
            'damage': item_data.get('damage', ''),
            'properties': item_data.get('properties', []),
            'armor_class': item_data.get('armor_class', ''),
            'subcategory': item_data.get('subcategory', ''),
            'effect': item_data.get('effect', [])  # Store effects in equipment_data
        }
    else:
        # Handle unequipping
        if item_type == "weapon":
            # Check if it's in main hand or offhand
            if character_data['equipped']['weapon'] == item_name:
                character_data['equipped']['weapon'] = ""
            elif character_data['equipped']['offhand'] == item_name:
                character_data['equipped']['offhand'] = ""
        else:
            # Only clear if this specific item is equipped
            if item_type in character_data['equipped'] and character_data['equipped'][item_type] == item_name:
                character_data['equipped'][item_type] = ""

        # Remove from equipment_data if not equipped anywhere
        is_equipped_elsewhere = False
        for slot, equipped_item in character_data['equipped'].items():
            if equipped_item == item_name:
                is_equipped_elsewhere = True
                break

        if not is_equipped_elsewhere and item_name in character_data['equipment_data']:
            del character_data['equipment_data'][item_name]

    save_data(character_data)
    return jsonify({
        'success': True,
        'updated_equipment': character_data['equipped']
    })


@app.route('/save_backstory', methods=['POST'])
def save_backstory():
    data = request.json
    backstory = data.get('backstory')

    character_data = load_data()

    # Ensure player_info exists
    if 'player_info' not in character_data:
        character_data['player_info'] = {}

    # Save backstory to player_info
    character_data['player_info']['backstory'] = backstory

    # Save the updated character data
    save_data(character_data)

    return jsonify({'success': True})


@app.route('/save_character_image', methods=['POST'])
def save_character_image():
    data = request.json
    image_url = data.get('image_url')

    character_data = load_data()

    # Ensure player_info exists
    if 'player_info' not in character_data:
        character_data['player_info'] = {}

    character_data['player_info']['image_url'] = image_url
    save_data(character_data)

    return jsonify({'success': True})


@app.route('/save_notes', methods=['POST'])
def save_notes():
    data = request.json
    notes = data.get('notes')

    character_data = load_data()
    character_data['notes'] = notes
    save_data(character_data)

    return jsonify({'success': True})

if __name__ == "__main__":
    app.run(debug=True)
