export function populateInventorySection(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <style>
            .inventory-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
                padding: 10px;
            }
            .inventory-item {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                background-color: #f9f9f9;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s;
            }
            .inventory-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            .item-name {
                margin-top: 0;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
            }
            .item-details {
                font-size: 0.9em;
            }
            .item-stats {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 8px 0;
                font-size: 0.85em;
                color: #555;
            }
            .item-description {
                font-style: italic;
                color: #666;
                margin: 5px 0;
            }
            .item-damage, .item-ac, .item-properties {
                font-weight: bold;
                color: #444;
            }
            .item-effects {
                font-size: 0.85em;
                background-color: #f0f0f0;
                padding: 5px;
                border-radius: 3px;
                margin-top: 5px;
            }
            .item-effects h5 {
                margin: 0 0 5px 0;
            }
            .item-effects ul {
                margin: 0;
                padding-left: 20px;
            }
            .item-category-weapon {
                border-left: 4px solid #c33;
            }
            .item-category-armor {
                border-left: 4px solid #33c;
            }
            .item-category-shield {
                border-left: 4px solid #33c;
            }
            .item-category-potion {
                border-left: 4px solid #3c3;
            }
            .item-category-scroll {
                border-left: 4px solid #c3c;
            }
            .item-category-misc {
                border-left: 4px solid #cc3;
            }
            .inventory-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding: 0 10px;
            }
            #itemSearch {
                flex-grow: 1;
                margin-right: 10px;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            .add-item-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            }
            .add-item-btn:hover {
                background-color: #45a049;
            }
        </style>
        <div class="inventory-header">
            <input type="text" id="itemSearch" placeholder="Search items...">
            <button id="addItemBtn" class="add-item-btn">+ Add Item</button>
        </div>
        <div id="inventoryList" class="inventory-list"></div>
        <div id="itemModal" class="modal hidden">
            <div class="modal-content">
                <h3 id="itemModalTitle">Add Item</h3>
                <label>
                    <input type="checkbox" id="usePredefined"> Use Predefined Item
                </label>
                <div id="predefinedContainer" style="display: none;">
                    <input type="text" id="predefinedSearch" placeholder="Search predefined items...">
                    <select id="predefinedItemsSelect" size="10" style="width: 100%; margin: 10px 0;"></select>
                    <div>
                        <label>Quantity:</label>
                        <input type="number" id="predefinedQuantity" value="1" min="1">
                    </div>
                </div>
                <div id="customItemContainer">
                    <label>Name:</label>
                    <input type="text" id="itemName">
                    <label>Description:</label>
                    <textarea id="itemDescription"></textarea>
                    <label>Value:</label>
                    <input type="number" id="itemValue" placeholder="Value">
                    <label>Weight:</label>
                    <input type="number" id="itemWeight" placeholder="Weight">
                    <label>Category:</label>
                    <select id="itemCategory">
                        <option value="weapon">Weapon</option>
                        <option value="shield">Shield</option>
                        <option value="armor">Armor</option>
                        <option value="scroll">Scroll</option>
                        <option value="potion">Potion</option>
                        <option value="misc">Misc</option>
                    </select>
                    <label>Quantity:</label>
                    <input type="number" id="itemQuantity" placeholder="Quantity" value="1">
                    <label>Effect (Optional):</label>
                    <div id="itemEffectsContainer"></div>
                    <button id="addItemEffectBtn" class="add-item-effect-btn">+ Add Effect</button>
                </div>
                <div class="modal-actions">
                    <button id="saveItemBtn" class="save-btn">Save</button>
                    <button id="closeItemBtn" class="close-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById("addItemBtn").addEventListener("click", openItemModal);
        document.getElementById("closeItemBtn").addEventListener("click", closeItemModal);
        document.getElementById("saveItemBtn").addEventListener("click", saveItem);
        document.getElementById("addItemEffectBtn").addEventListener("click", () => addItemEffectRow());
        document.getElementById("usePredefined").addEventListener("change", togglePredefined);
        document.getElementById("predefinedSearch").addEventListener("input", filterPredefinedItems);
        document.getElementById("itemSearch").addEventListener("input", filterInventoryItems);

        loadInventory();
        loadPredefinedItems();
    }, 100);

    let editingItemIndex = null;

    function openItemModal() {
        document.getElementById("itemModalTitle").textContent = "Add Item";
        document.getElementById("usePredefined").checked = false;
        togglePredefined();
        document.getElementById("itemName").value = "";
        document.getElementById("itemDescription").value = "";
        document.getElementById("itemValue").value = "";
        document.getElementById("itemWeight").value = "";
        document.getElementById("itemCategory").value = "misc";
        document.getElementById("itemQuantity").value = "1";
        document.getElementById("itemEffectsContainer").innerHTML = "";
        editingItemIndex = null;
        document.getElementById("itemModal").classList.remove("hidden");
    }

    function closeItemModal() {
        document.getElementById("itemModal").classList.add("hidden");
    }

    function togglePredefined() {
        const usePredefined = document.getElementById("usePredefined").checked;
        const predefinedContainer = document.getElementById("predefinedContainer");
        const customItemContainer = document.getElementById("customItemContainer");
        
        if (usePredefined) {
            predefinedContainer.style.display = "block";
            customItemContainer.style.display = "none";
            
            // When switching to predefined, update the predefined quantity field
            const quantity = document.getElementById("itemQuantity").value;
            document.getElementById("predefinedQuantity").value = quantity;
        } else {
            predefinedContainer.style.display = "none";
            customItemContainer.style.display = "block";
            
            // When switching to custom, update the custom quantity field
            const quantity = document.getElementById("predefinedQuantity").value;
            document.getElementById("itemQuantity").value = quantity;
        }
    }

    function filterPredefinedItems() {
        const query = document.getElementById("predefinedSearch").value.toLowerCase();
        const select = document.getElementById("predefinedItemsSelect");
        Array.from(select.options).forEach(option => {
            if (option.text.toLowerCase().includes(query)) {
                option.style.display = "";
            } else {
                option.style.display = "none";
            }
        });
    }

    function filterInventoryItems() {
        const query = document.getElementById("itemSearch").value.toLowerCase();
        const items = document.querySelectorAll(".inventory-item");
        items.forEach(item => {
            const itemName = item.querySelector(".item-name").textContent.toLowerCase();
            if (itemName.includes(query)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }

    function loadPredefinedItems() {
        fetch("/static/items.json")
            .then(response => response.json())
            .then(data => {
                const predefinedItems = data.predefined_items || {};
                const select = document.getElementById("predefinedItemsSelect");
                select.innerHTML = "";
                
                // Create option groups for each category
                const categories = {
                    "Weapons": ["weapons"],
                    "Armor": ["armor"],
                    "Adventuring Gear": ["adventuring_gear"]
                };
                
                // Create option groups and populate them
                Object.entries(categories).forEach(([groupName, categoryKeys]) => {
                    const optGroup = document.createElement("optgroup");
                    optGroup.label = groupName;
                    
                    // Process each category
                    categoryKeys.forEach(categoryKey => {
                        if (!predefinedItems[categoryKey]) return;
                        
                        // Process subcategories (like simple_melee, light_armor, etc.)
                        Object.entries(predefinedItems[categoryKey]).forEach(([subcatKey, subcatItems]) => {
                            // Process items in subcategory
                            Object.entries(subcatItems).forEach(([itemKey, item]) => {
                                const fullKey = `${categoryKey}.${subcatKey}.${itemKey}`;
                                const option = document.createElement("option");
                                option.value = fullKey;
                                option.text = item.name;
                                optGroup.appendChild(option);
                            });
                        });
                    });
                    
                    if (optGroup.children.length > 0) {
                        select.appendChild(optGroup);
                    }
                });
            })
            .catch(() => console.warn("Failed to load predefined items"));
    }

    function loadInventory() {
        fetch("/static/data.json")
            .then(response => response.json())
            .then(data => {
                const inventory = data.inventory || [];
                const inventoryList = document.getElementById("inventoryList");
                inventoryList.innerHTML = "";
                inventory.forEach((item, index) => {
                    addItemToList(item, index);
                });
            })
            .catch(() => console.warn("Failed to load inventory from data.json"));
    }

    function addItemToList(item, index) {
        const inventoryList = document.getElementById("inventoryList");
        const itemElement = document.createElement("div");
        itemElement.classList.add("inventory-item");
        
        // Determine item category for styling
        const categoryClass = item.category ? `item-category-${item.category}` : '';
        if (categoryClass) {
            itemElement.classList.add(categoryClass);
        }
        
        // Build the item details HTML
        let detailsHtml = '';
        
        // Add damage for weapons
        if (item.damage) {
            detailsHtml += `<p class="item-damage">Damage: ${item.damage}</p>`;
        }
        
        // Add armor class for armor
        if (item.armor_class) {
            detailsHtml += `<p class="item-ac">AC: ${item.armor_class}</p>`;
        }
        
        // Add properties for weapons
        if (item.properties && item.properties.length > 0) {
            detailsHtml += `<p class="item-properties">Properties: ${item.properties.join(', ')}</p>`;
        }
        
        // Add basic details
        detailsHtml += `
            <p class="item-description">${item.description || ""}</p>
            <div class="item-stats">
                <span>Value: ${item.value} gp</span>
                <span>Weight: ${item.weight} lb</span>
                <span>Quantity: ${item.quantity}</span>
            </div>
        `;
        
        // Add effects if any
        if (item.effect && item.effect.length > 0) {
            detailsHtml += `<div class="item-effects"><h5>Effects:</h5><ul>`;
            item.effect.forEach(effect => {
                let effectText = `${effect.target}`;
                if (effect.category === "stat") {
                    effectText += `: ${effect.amount > 0 ? '+' : ''}${effect.amount}`;
                    if (effect.modifier === "per") {
                        effectText += ` per ${effect.perTarget} (${effect.perAmount})`;
                    }
                }
                detailsHtml += `<li>${effectText}</li>`;
            });
            detailsHtml += `</ul></div>`;
        }
        
        itemElement.innerHTML = `
            <h4 class="item-name">${item.name}</h4>
            <div class="item-details">
                ${detailsHtml}
            </div>
            <div class="item-actions">
                <button class="edit-item">Edit</button>
                <button class="remove-item">Remove</button>
            </div>
        `;
        
        inventoryList.appendChild(itemElement);

        itemElement.querySelector(".edit-item").addEventListener("click", () => editItem(index, item));
        itemElement.querySelector(".remove-item").addEventListener("click", () => removeItem(index));
    }

    function editItem(index, item) {
        editingItemIndex = index;
        document.getElementById("itemModalTitle").textContent = "Edit Item";
        
        if (item.predefined) {
            document.getElementById("usePredefined").checked = true;
            togglePredefined();
            document.getElementById("predefinedItemsSelect").value = item.predefinedKey;
            document.getElementById("predefinedQuantity").value = item.quantity || 1;
        } else {
            document.getElementById("usePredefined").checked = false;
            togglePredefined();
            document.getElementById("itemName").value = item.name;
            document.getElementById("itemDescription").value = item.description || "";
            document.getElementById("itemValue").value = item.value;
            document.getElementById("itemWeight").value = item.weight;
            document.getElementById("itemCategory").value = item.category || "misc";
            document.getElementById("itemQuantity").value = item.quantity || 1;
            document.getElementById("itemEffectsContainer").innerHTML = "";
            
            if (item.effect && Array.isArray(item.effect)) {
                item.effect.forEach(effect => addItemEffectRow(effect));
            }
        }
        
        document.getElementById("itemModal").classList.remove("hidden");
    }

    function removeItem(index) {
        fetch("/remove_item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index }),
        }).then(() => {
            loadInventory();
        });
    }

    function saveItem() {
        const usePredefined = document.getElementById("usePredefined").checked;
        let itemData = {};
        if (usePredefined) {
            const select = document.getElementById("predefinedItemsSelect");
            const predefinedKey = select.value;
            if (!predefinedKey) {
                alert("Please select a predefined item.");
                return;
            }
            
            // Fetch the predefined item data
            fetch("/static/items.json")
                .then(response => response.json())
                .then(data => {
                    // Parse the key path (e.g., "weapons.simple_melee.dagger")
                    const keyParts = predefinedKey.split('.');
                    let itemTemplate = data.predefined_items;
                    
                    // Navigate through the object structure
                    for (const part of keyParts) {
                        if (!itemTemplate[part]) {
                            alert("Item not found in predefined items.");
                            return;
                        }
                        itemTemplate = itemTemplate[part];
                    }
                    
                    // Create a copy of the template with quantity
                    itemData = JSON.parse(JSON.stringify(itemTemplate));
                    itemData.predefined = true;
                    itemData.predefinedKey = predefinedKey;
                    itemData.quantity = parseInt(document.getElementById("itemQuantity").value) || 1;
                    
                    // Save the item
                    saveItemToServer(itemData);
                })
                .catch(error => {
                    console.error("Error loading predefined item:", error);
                    alert("Failed to load predefined item data.");
                });
        } else {
            const name = document.getElementById("itemName").value.trim();
            if (!name) {
                alert("Item must have a name.");
                return;
            }
            itemData.name = name;
            itemData.description = document.getElementById("itemDescription").value.trim();
            itemData.value = parseFloat(document.getElementById("itemValue").value) || 0;
            itemData.weight = parseFloat(document.getElementById("itemWeight").value) || 0;
            itemData.category = document.getElementById("itemCategory").value;
            itemData.quantity = parseInt(document.getElementById("itemQuantity").value) || 1;
            itemData.effect = [];
            document.querySelectorAll("#itemEffectsContainer .effect-row").forEach(row => {
                const category = row.querySelector(".effect-category").value;
                const target = row.querySelector(".effect-target").value;
                if (!target) return;
                const effectData = { category, target };
                if (category === "stat") {
                    effectData.amount = parseInt(row.querySelector(".effect-amount").value) || 0;
                    effectData.modifier = row.querySelector(".effect-modifier").value;
                    if (effectData.modifier === "per") {
                        effectData.perTarget = row.querySelector(".effect-per-target").value || null;
                        effectData.perAmount = parseInt(row.querySelector(".effect-per-amount").value) || null;
                    }
                }
                itemData.effect.push(effectData);
            });
            
            // Save the custom item
            saveItemToServer(itemData);
        }
    }
    
    function saveItemToServer(itemData) {
        fetch("/save_item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index: editingItemIndex, item: itemData }),
        }).then(() => {
            loadInventory();
            closeItemModal();
        }).catch(error => {
            console.error("Error saving item:", error);
            alert("Failed to save item.");
        });
    }

    function addItemEffectRow(effect = {}) {
        const container = document.getElementById("itemEffectsContainer");
        const effectRow = document.createElement("div");
        effectRow.classList.add("effect-row");
        effectRow.innerHTML = `
            <select class="effect-category">
                <option value="stat" ${effect.category === "stat" ? "selected" : ""}>Stat</option>
                <option value="proficiency" ${effect.category === "proficiency" ? "selected" : ""}>Proficiency</option>
            </select>
            <select class="effect-target"></select>
            <input type="number" class="effect-amount" placeholder="Flat Bonus" style="width: 100px;">
            <select class="effect-modifier">
                <option value="none" ${effect.modifier === "none" ? "selected" : ""}>None</option>
                <option value="per" ${effect.modifier === "per" ? "selected" : ""}>Per</option>
            </select>
            <div class="per-container" style="display: none;">
                <select class="effect-per-target"></select>
                <input type="number" class="effect-per-amount" placeholder="Per amount" style="width: 100px;">
            </div>
            <button class="remove-effect-btn">✖</button>
        `;

        const categorySelect = effectRow.querySelector(".effect-category");
        const targetSelect = effectRow.querySelector(".effect-target");
        const amountField = effectRow.querySelector(".effect-amount");
        const modifierSelect = effectRow.querySelector(".effect-modifier");
        const perContainer = effectRow.querySelector(".per-container");

        const ALL_STATS = [
            "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma",
            "Armor Class", "Speed", "Initiative", "Health", "Proficiency Bonus"
        ];
        const ALL_PROFICIENCIES = [
            "Strength Save", "Dexterity Save", "Constitution Save", "Intelligence Save",
            "Wisdom Save", "Charisma Save", "Acrobatics", "Animal Handling", "Arcana",
            "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation",
            "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion",
            "Sleight of Hand", "Stealth", "Survival"
        ];

        function updateFields() {
            if (categorySelect.value === "proficiency") {
                targetSelect.innerHTML = ALL_PROFICIENCIES.map(prof => `<option value="${prof}">${prof}</option>`).join("");
                amountField.style.display = "none";
                modifierSelect.style.display = "none";
                perContainer.style.display = "none";
            } else {
                targetSelect.innerHTML = ALL_STATS.map(stat => `<option value="${stat}">${stat}</option>`).join("");
                targetSelect.innerHTML += ALL_PROFICIENCIES.map(prof => `<option value="${prof}">${prof}</option>`).join("");
                amountField.style.display = "inline-block";
                modifierSelect.style.display = "inline-block";
                updatePerFields();
            }
        }

        function updatePerFields() {
            perContainer.style.display = modifierSelect.value === "per" ? "inline-block" : "none";
        }

        categorySelect.addEventListener("change", updateFields);
        modifierSelect.addEventListener("change", updatePerFields);

        categorySelect.dispatchEvent(new Event("change"));
        modifierSelect.dispatchEvent(new Event("change"));

        effectRow.querySelector(".remove-effect-btn").addEventListener("click", () => {
            effectRow.remove();
            moveAddItemEffectButton();
        });

        container.appendChild(effectRow);
        moveAddItemEffectButton();
    }

    function moveAddItemEffectButton() {
        let addEffectBtn = document.getElementById("addItemEffectBtn");
        const container = document.getElementById("itemEffectsContainer");
        if (!addEffectBtn) {
            addEffectBtn = document.createElement("button");
            addEffectBtn.id = "addItemEffectBtn";
            addEffectBtn.classList.add("add-item-effect-btn");
            addEffectBtn.textContent = "+ Add Effect";
            addEffectBtn.addEventListener("click", () => addItemEffectRow());
        }
        container.appendChild(addEffectBtn);
    }
}
