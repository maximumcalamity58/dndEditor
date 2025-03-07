export function populateInventorySection(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <style>
            /* Inventory List Styling */
            .inventory-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
                padding: 10px;
                margin-top: 10px;
                max-width: 100%;
            }
            .inventory-item {
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
                border-radius: 5px;
                padding: 12px;
                background-color: var(--bg-color-secondary, rgba(30, 30, 30, 0.6));
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            .inventory-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            .item-name {
                margin-top: 0;
                margin-bottom: 8px;
                border-bottom: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                padding-bottom: 5px;
                font-size: 1.1em;
                font-weight: 600;
                color: var(--text-color-primary, rgba(255, 255, 255, 0.9));
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
                color: var(--text-color-secondary, rgba(255, 255, 255, 0.7));
                background-color: rgba(0,0,0,0.2);
                padding: 5px;
                border-radius: 3px;
            }
            .item-description {
                font-style: italic;
                color: var(--text-color-secondary, rgba(255, 255, 255, 0.7));
                margin: 5px 0;
                line-height: 1.4;
            }
            .item-damage, .item-ac, .item-properties {
                font-weight: 600;
                color: var(--text-color-primary, rgba(255, 255, 255, 0.9));
                margin: 4px 0;
            }
            .item-effects {
                font-size: 0.85em;
                background-color: rgba(0,0,0,0.2);
                padding: 8px;
                border-radius: 3px;
                margin-top: 8px;
                border-left: 3px solid var(--accent-color, #4a6fa5);
            }
            .item-effects h5 {
                margin: 0 0 5px 0;
                color: var(--accent-color, #6a8fc5);
            }
            .item-effects ul {
                margin: 0;
                padding-left: 20px;
            }
            
            /* Category Styling */
            .item-category-weapon {
                border-left: 4px solid var(--weapon-color, #e55);
            }
            .item-category-armor {
                border-left: 4px solid var(--armor-color, #55e);
            }
            .item-category-shield {
                border-left: 4px solid var(--shield-color, #55e);
            }
            .item-category-potion {
                border-left: 4px solid var(--potion-color, #5e5);
            }
            .item-category-scroll {
                border-left: 4px solid var(--scroll-color, #e5e);
            }
            .item-category-misc {
                border-left: 4px solid var(--misc-color, #ee5);
            }
            .item-category-wondrous {
                border-left: 4px solid var(--wondrous-color, #fa0);
            }
            .item-category-clothing {
                border-left: 4px solid var(--clothing-color, #a7e);
            }
            
            /* Header Styling */
            .inventory-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding: 0 10px;
                max-width: 100%;
            }
            #itemSearch {
                flex-grow: 1;
                margin-right: 15px;
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
                font-size: 0.95em;
                transition: border-color 0.2s;
            }
            #itemSearch:focus {
                border-color: var(--accent-color, #4a6fa5);
                outline: none;
                box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.3);
            }
            .add-item-btn {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: background-color 0.2s;
            }
            .add-item-btn:hover {
                background-color: var(--accent-color-hover, #3a5f95);
            }
            
            /* Item Actions */
            .item-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 10px;
            }
            .edit-item, .remove-item {
                padding: 5px 10px;
                border-radius: 3px;
                border: 1px solid var(--border-color, #ccc);
                background-color: var(--bg-color, #fff);
                cursor: pointer;
                font-size: 0.85em;
                transition: all 0.2s;
            }
            .edit-item {
                color: var(--accent-color, #4a6fa5);
            }
            .edit-item:hover {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
                border-color: var(--accent-color, #4a6fa5);
            }
            .remove-item {
                color: var(--danger-color, #d33);
            }
            .remove-item:hover {
                background-color: var(--danger-color, #d33);
                color: white;
                border-color: var(--danger-color, #d33);
            }
            
            /* Form Layout */
            .form-row {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 10px;
                gap: 15px;
                max-width: 100%;
            }
            .form-group {
                flex: 1;
                min-width: 200px;
                max-width: 100%;
            }
            .form-group.half {
                flex: 0 0 calc(50% - 8px);
                min-width: 150px;
            }
            .item-details-section {
                background-color: var(--bg-color-secondary, rgba(40, 40, 40, 0.6));
                border: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                border-radius: 6px;
                padding: 15px;
                margin: 15px 0;
            }
            .item-details-section h4 {
                margin-top: 0;
                margin-bottom: 12px;
                color: var(--accent-color, #6a8fc5);
                font-size: 1em;
            }
            
            /* Modal Styling */
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal.hidden {
                display: none;
            }
            .modal-content {
                background-color: var(--bg-color, #222);
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                width: 90%;
                max-width: 600px;
                max-height: 85vh;
                overflow-y: auto;
            }
            .modal-content h3 {
                margin-top: 0;
                color: var(--accent-color, #6a8fc5);
                border-bottom: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                padding-bottom: 10px;
            }
            .modal-content label {
                display: block;
                margin: 12px 0 4px;
                font-weight: 600;
                color: var(--text-color-primary, rgba(255, 255, 255, 0.9));
            }
            .modal-content input[type="text"],
            .modal-content input[type="number"],
            .modal-content textarea,
            .modal-content select {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                font-size: 0.95em;
                margin-bottom: 5px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }
            .modal-content textarea {
                min-height: 80px;
                resize: vertical;
            }
            .modal-content input:focus,
            .modal-content textarea:focus,
            .modal-content select:focus {
                border-color: var(--accent-color, #4a6fa5);
                outline: none;
                box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.3);
            }
            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
                border-top: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                padding-top: 15px;
            }
            .save-btn, .close-btn {
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            .save-btn {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
                border: none;
            }
            .save-btn:hover {
                background-color: var(--accent-color-hover, #3a5f95);
            }
            .close-btn {
                background-color: rgba(60, 60, 60, 0.6);
                color: var(--text-color-secondary, rgba(255, 255, 255, 0.8));
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
            }
            .close-btn:hover {
                background-color: rgba(80, 80, 80, 0.8);
            }
            
            /* Predefined Items Section */
            #predefinedContainer {
                border: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                border-radius: 6px;
                padding: 15px;
                margin: 15px 0;
                background-color: var(--bg-color-secondary, rgba(40, 40, 40, 0.6));
            }
            #predefinedSearch {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                margin-bottom: 10px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }
            #predefinedItemsSelect {
                width: 100%;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                padding: 5px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }
            #predefinedItemsSelect optgroup {
                font-weight: bold;
                color: var(--accent-color, #6a8fc5);
                background-color: rgba(20, 20, 20, 0.8);
            }
            #predefinedItemsSelect option {
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }
            #predefinedQuantity {
                width: 80px;
                padding: 6px 8px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }
            
            /* Effects Section */
            #itemEffectsContainer {
                margin-top: 10px;
                border: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                border-radius: 4px;
                padding: 10px;
                background-color: var(--bg-color-secondary, rgba(40, 40, 40, 0.6));
            }
            .effect-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px dashed var(--border-color-light, rgba(255, 255, 255, 0.1));
                align-items: center;
            }
            .effect-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .effect-row select, 
            .effect-row input {
                padding: 6px 8px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                font-size: 0.9em;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }
            .remove-effect-btn {
                background-color: rgba(221, 51, 51, 0.2);
                color: var(--danger-color, #f55);
                border: 1px solid rgba(221, 51, 51, 0.3);
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 12px;
                padding: 0;
                margin-left: auto;
            }
            .remove-effect-btn:hover {
                background-color: var(--danger-color, #d33);
                color: white;
            }
            .add-item-effect-btn {
                background-color: rgba(74, 111, 165, 0.2);
                color: var(--accent-color, #6a8fc5);
                border: 1px solid rgba(74, 111, 165, 0.3);
                border-radius: 4px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 0.9em;
                margin-top: 10px;
                transition: all 0.2s;
            }
            .add-item-effect-btn:hover {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
            }
            
            /* Category Filters */
            .inventory-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 10px;
                max-width: 100%;
            }
            .filter-btn {
                background-color: var(--bg-color, rgba(30, 30, 30, 0.6));
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                color: rgba(255, 255, 255, 0.8);
                border-radius: 20px;
                padding: 5px 12px;
                font-size: 0.85em;
                cursor: pointer;
                transition: all 0.2s;
            }
            .filter-btn:hover, .filter-btn.active {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
                border-color: var(--accent-color, #4a6fa5);
            }
        </style>
        <div style="max-width: 100%;">
            <div class="inventory-header">
                <input type="text" id="itemSearch" placeholder="Search items...">
                <button id="addItemBtn" class="add-item-btn">+ Add Item</button>
            </div>
            <div class="inventory-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="weapon">Weapons</button>
                <button class="filter-btn" data-filter="armor">Armor</button>
                <button class="filter-btn" data-filter="shield">Shields</button>
                <button class="filter-btn" data-filter="clothing">Clothing</button>
                <button class="filter-btn" data-filter="potion">Potions</button>
                <button class="filter-btn" data-filter="scroll">Scrolls</button>
                <button class="filter-btn" data-filter="misc">Misc</button>
            </div>
            <div id="inventoryList" class="inventory-list"></div>
        </div>
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
                    <div class="form-row">
                        <div class="form-group">
                            <label>Name:</label>
                            <input type="text" id="itemName">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="itemDescription"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group half">
                            <label>Value (gp):</label>
                            <input type="number" id="itemValue" placeholder="Value" step="0.1" min="0">
                        </div>
                        <div class="form-group half">
                            <label>Weight (lb):</label>
                            <input type="number" id="itemWeight" placeholder="Weight" step="0.1" min="0">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group half">
                            <label>Category:</label>
                            <select id="itemCategory">
                                <option value="weapon">Weapon</option>
                                <option value="armor">Armor</option>
                                <option value="shield">Shield</option>
                                <option value="clothing">Clothing</option>
                                <option value="scroll">Scroll</option>
                                <option value="potion">Potion</option>
                                <option value="wondrous">Wondrous Item</option>
                                <option value="misc">Misc</option>
                            </select>
                        </div>
                        <div class="form-group half">
                            <label>Quantity:</label>
                            <input type="number" id="itemQuantity" placeholder="Quantity" value="1" min="1">
                        </div>
                    </div>
                    
                    <div id="weaponDetails" class="item-details-section" style="display: none;">
                        <h4>Weapon Details</h4>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>Damage:</label>
                                <input type="text" id="itemDamage" placeholder="e.g. 1d6 slashing">
                            </div>
                            <div class="form-group half">
                                <label>Properties:</label>
                                <input type="text" id="itemProperties" placeholder="e.g. Finesse, Light">
                            </div>
                        </div>
                    </div>
                    
                    <div id="armorDetails" class="item-details-section" style="display: none;">
                        <h4>Armor Details</h4>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>Armor Class:</label>
                                <input type="text" id="itemArmorClass" placeholder="e.g. 12 + Dex modifier">
                            </div>
                            <div class="form-group half">
                                <label>Type:</label>
                                <select id="armorType">
                                    <option value="light">Light Armor</option>
                                    <option value="medium">Medium Armor</option>
                                    <option value="heavy">Heavy Armor</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>Strength Requirement:</label>
                                <input type="text" id="itemStrRequirement" placeholder="e.g. 13">
                            </div>
                            <div class="form-group half">
                                <label>Stealth:</label>
                                <select id="itemStealth">
                                    <option value="none">Normal</option>
                                    <option value="disadvantage">Disadvantage</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div id="clothingDetails" class="item-details-section" style="display: none;">
                        <h4>Clothing/Accessory Details</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Slot:</label>
                                <select id="itemSlot">
                                    <option value="head">Head</option>
                                    <option value="neck">Neck</option>
                                    <option value="shoulders">Shoulders</option>
                                    <option value="chest">Chest</option>
                                    <option value="back">Back</option>
                                    <option value="wrists">Wrists</option>
                                    <option value="hands">Hands</option>
                                    <option value="waist">Waist</option>
                                    <option value="legs">Legs</option>
                                    <option value="feet">Feet</option>
                                    <option value="finger">Finger</option>
                                </select>
                            </div>
                        </div>
                    </div>
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
        document.getElementById("itemCategory").addEventListener("change", toggleItemDetails);
        
        // Add event listeners to filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', filterByCategory);
        });

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
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const items = document.querySelectorAll(".inventory-item");
        
        items.forEach(item => {
            const itemName = item.querySelector(".item-name").textContent.toLowerCase();
            const itemCategory = item.className.split(' ')
                .find(cls => cls.startsWith('item-category-'))?.replace('item-category-', '') || '';
            
            const matchesSearch = itemName.includes(query);
            const matchesCategory = activeFilter === 'all' || itemCategory === activeFilter;
            
            if (matchesSearch && matchesCategory) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }
    
    function filterByCategory(e) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Filter items
        filterInventoryItems();
    }
    
    function toggleItemDetails() {
        const category = document.getElementById("itemCategory").value;
        
        // Hide all detail sections first
        document.querySelectorAll('.item-details-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the appropriate section based on category
        if (category === 'weapon') {
            document.getElementById('weaponDetails').style.display = 'block';
        } else if (category === 'armor') {
            document.getElementById('armorDetails').style.display = 'block';
        } else if (category === 'clothing') {
            document.getElementById('clothingDetails').style.display = 'block';
        }
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
            
            // Basic item data
            document.getElementById("itemName").value = item.name;
            document.getElementById("itemDescription").value = item.description || "";
            document.getElementById("itemValue").value = item.value;
            document.getElementById("itemWeight").value = item.weight;
            document.getElementById("itemCategory").value = item.category || "misc";
            document.getElementById("itemQuantity").value = item.quantity || 1;
            
            // Trigger category-specific fields
            toggleItemDetails();
            
            // Fill in category-specific data
            if (item.category === 'weapon') {
                document.getElementById("itemDamage").value = item.damage || "";
                document.getElementById("itemProperties").value = item.properties ? item.properties.join(', ') : "";
            } else if (item.category === 'armor') {
                document.getElementById("itemArmorClass").value = item.armor_class || "";
                document.getElementById("armorType").value = item.armor_type || "light";
                document.getElementById("itemStrRequirement").value = item.strength_requirement || "";
                document.getElementById("itemStealth").value = item.stealth === "Disadvantage" ? "disadvantage" : "none";
            } else if (item.category === 'clothing') {
                document.getElementById("itemSlot").value = item.slot || "chest";
            }
            
            // Effects
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
                    itemData.quantity = parseInt(document.getElementById("predefinedQuantity").value) || 1;
                    
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
            
            // Basic item data
            itemData.name = name;
            itemData.description = document.getElementById("itemDescription").value.trim();
            itemData.value = parseFloat(document.getElementById("itemValue").value) || 0;
            itemData.weight = parseFloat(document.getElementById("itemWeight").value) || 0;
            itemData.category = document.getElementById("itemCategory").value;
            itemData.quantity = parseInt(document.getElementById("itemQuantity").value) || 1;
            
            // Category-specific data
            if (itemData.category === 'weapon') {
                itemData.damage = document.getElementById("itemDamage").value.trim();
                const propertiesText = document.getElementById("itemProperties").value.trim();
                if (propertiesText) {
                    itemData.properties = propertiesText.split(',').map(p => p.trim());
                }
            } else if (itemData.category === 'armor') {
                itemData.armor_class = document.getElementById("itemArmorClass").value.trim();
                itemData.armor_type = document.getElementById("armorType").value;
                
                const strReq = document.getElementById("itemStrRequirement").value.trim();
                if (strReq) {
                    itemData.strength_requirement = strReq;
                }
                
                const stealth = document.getElementById("itemStealth").value;
                if (stealth === 'disadvantage') {
                    itemData.stealth = "Disadvantage";
                }
            } else if (itemData.category === 'clothing') {
                itemData.slot = document.getElementById("itemSlot").value;
            }
            
            // Effects
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
