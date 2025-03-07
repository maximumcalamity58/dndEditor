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
            .effect-advantage {
                color: #2ecc71; /* Green for advantage */
            }
            .effect-disadvantage {
                color: #e74c3c; /* Red for disadvantage */
            }
            .effect-condition {
                color: #f39c12; /* Orange for conditions */
            }
            .effect-resistance {
                color: #3498db; /* Blue for resistances */
            }
            .effect-immunity {
                color: #9b59b6; /* Purple for immunities */
            }
            .effect-vulnerability {
                color: #e67e22; /* Dark orange for vulnerabilities */
            }
            
            /* Structured Inputs */
            .structured-input {
                display: flex;
                gap: 5px;
                align-items: center;
                width: 100%;
            }
            .structured-input select,
            .structured-input input {
                flex: 1;
                min-width: 0;
            }
            .property-checkboxes {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 5px;
                max-height: 150px;
                overflow-y: auto;
                padding: 5px;
                background-color: rgba(30, 30, 30, 0.6);
                border-radius: 4px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
            }
            .property-checkboxes label {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.9em;
                margin: 0;
            }
            
            /* Damage Dice Styling */
            #damageDiceContainer {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 10px;
            }
            .damage-dice-row {
                display: flex;
                align-items: center;
                width: 100%;
            }
            .damage-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
            }
            .add-damage-btn {
                background-color: var(--accent-color, rgba(74, 111, 165, 0.2));
                color: var(--accent-color, #6a8fc5);
                border: 1px solid rgba(74, 111, 165, 0.3);
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 0.85em;
                cursor: pointer;
            }
            .add-damage-btn:hover {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
            }
            .remove-damage-btn {
                background-color: rgba(221, 51, 51, 0.2);
                color: var(--danger-color, #f55);
                border: 1px solid rgba(221, 51, 51, 0.3);
                border-radius: 50%;
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 12px;
                padding: 0;
                margin-left: 5px;
            }
            .remove-damage-btn:hover {
                background-color: var(--danger-color, #d33);
                color: white;
            }
            .damage-modifier {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .damage-modifier input {
                width: 50px;
                text-align: center;
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
            
            /* Modal Tabs */
            .modal-tabs {
                display: flex;
                margin-bottom: 15px;
                border-bottom: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
            }
            .modal-tab {
                padding: 10px 20px;
                background: none;
                border: none;
                color: var(--text-color-secondary, rgba(255, 255, 255, 0.7));
                cursor: pointer;
                font-size: 1em;
                font-weight: 600;
                transition: all 0.2s;
                border-bottom: 3px solid transparent;
                margin-bottom: -1px;
            }
            .modal-tab:hover {
                color: var(--text-color-primary, rgba(255, 255, 255, 0.9));
            }
            .modal-tab.active {
                color: var(--accent-color, #6a8fc5);
                border-bottom: 3px solid var(--accent-color, #6a8fc5);
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
                display: flex;
                flex-direction: column;
                height: 500px;
                max-height: 70vh;
            }
            .search-container {
                margin-bottom: 15px;
            }
            #predefinedSearch {
                padding: 10px 12px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                margin-bottom: 10px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
                font-size: 1em;
            }
            .category-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 10px;
            }
            .category-filter {
                background-color: rgba(30, 30, 30, 0.6);
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                color: var(--text-color-secondary, rgba(255, 255, 255, 0.7));
                border-radius: 20px;
                padding: 5px 12px;
                font-size: 0.85em;
                cursor: pointer;
                transition: all 0.2s;
            }
            .category-filter:hover, .category-filter.active {
                background-color: var(--accent-color, #4a6fa5);
                color: white;
                border-color: var(--accent-color, #4a6fa5);
            }
            .items-container {
                flex: 1;
                margin-bottom: 15px;
                min-height: 200px;
            }
            #predefinedItemsSelect {
                width: 100%;
                height: 100%;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                padding: 5px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
                overflow-y: auto;
            }
            #predefinedItemsSelect optgroup {
                font-weight: bold;
                color: var(--accent-color, #6a8fc5);
                background-color: rgba(20, 20, 20, 0.8);
                padding: 5px;
            }
            #predefinedItemsSelect option {
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
                padding: 8px 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                cursor: pointer;
            }
            #predefinedItemsSelect option:hover {
                background-color: rgba(74, 111, 165, 0.3);
            }
            .item-preview {
                background-color: rgba(40, 40, 40, 0.6);
                border: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 15px;
                max-height: 150px;
                overflow-y: auto;
            }
            .item-preview h4 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--accent-color, #6a8fc5);
                border-bottom: 1px solid var(--border-color-light, rgba(255, 255, 255, 0.1));
                padding-bottom: 5px;
            }
            .quantity-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #predefinedQuantity {
                width: 80px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
                border-radius: 4px;
                background-color: rgba(30, 30, 30, 0.6);
                color: rgba(255, 255, 255, 0.9);
                font-size: 1em;
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
                flex-direction: column;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px dashed var(--border-color-light, rgba(255, 255, 255, 0.1));
            }
            .effect-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .effect-main-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
                margin-bottom: 8px;
            }
            .per-container {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
                background-color: rgba(30, 30, 30, 0.4);
                padding: 8px;
                border-radius: 4px;
                margin-left: 20px;
            }
            .per-label {
                font-size: 0.9em;
                color: rgba(255, 255, 255, 0.7);
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
            .effect-category {
                min-width: 100px;
            }
            .effect-target {
                min-width: 140px;
            }
            .effect-per-target {
                min-width: 140px;
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
                <div class="modal-tabs">
                    <button id="predefinedTabBtn" class="modal-tab active">Predefined Items</button>
                    <button id="customTabBtn" class="modal-tab">Custom Item</button>
                </div>
                <div id="predefinedContainer">
                    <div class="search-container">
                        <input type="text" id="predefinedSearch" placeholder="Search items...">
                        <div class="category-filters">
                            <button class="category-filter active" data-category="all">All</button>
                            <button class="category-filter" data-category="weapon">Weapons</button>
                            <button class="category-filter" data-category="armor">Armor</button>
                            <button class="category-filter" data-category="clothing">Clothing</button>
                            <button class="category-filter" data-category="misc">Gear</button>
                        </div>
                    </div>
                    <div class="items-container">
                        <select id="predefinedItemsSelect" size="12"></select>
                    </div>
                    <div class="item-preview" id="itemPreview">
                        <h4 id="previewName">Select an item</h4>
                        <div id="previewDetails"></div>
                    </div>
                    <div class="quantity-container">
                        <label>Quantity:</label>
                        <input type="number" id="predefinedQuantity" value="1" min="1">
                    </div>
                </div>
                <div id="customItemContainer" style="display: none;">
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
                            <label>Subcategory:</label>
                            <select id="itemSubcategory"></select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Quantity:</label>
                            <input type="number" id="itemQuantity" placeholder="Quantity" value="1" min="1">
                        </div>
                    </div>
                    
                    <div id="weaponDetails" class="item-details-section" style="display: none;">
                        <h4>Weapon Details</h4>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>Damage:</label>
                                <div id="damageDiceContainer">
                                    <div class="damage-dice-row">
                                        <div class="structured-input">
                                            <select class="item-damage-dice">
                                                <option value="1d4">1d4</option>
                                                <option value="1d6">1d6</option>
                                                <option value="1d8">1d8</option>
                                                <option value="1d10">1d10</option>
                                                <option value="1d12">1d12</option>
                                                <option value="2d4">2d4</option>
                                                <option value="2d6">2d6</option>
                                                <option value="2d8">2d8</option>
                                                <option value="2d10">2d10</option>
                                                <option value="2d12">2d12</option>
                                                <option value="3d6">3d6</option>
                                                <option value="3d8">3d8</option>
                                                <option value="4d6">4d6</option>
                                                <option value="4d8">4d8</option>
                                                <option value="6d6">6d6</option>
                                                <option value="8d6">8d6</option>
                                                <option value="10d6">10d6</option>
                                                <option value="12d6">12d6</option>
                                            </select>
                                            <select class="item-damage-type">
                                                <option value="slashing">Slashing</option>
                                                <option value="piercing">Piercing</option>
                                                <option value="bludgeoning">Bludgeoning</option>
                                                <option value="fire">Fire</option>
                                                <option value="cold">Cold</option>
                                                <option value="lightning">Lightning</option>
                                                <option value="acid">Acid</option>
                                                <option value="poison">Poison</option>
                                                <option value="psychic">Psychic</option>
                                                <option value="necrotic">Necrotic</option>
                                                <option value="radiant">Radiant</option>
                                                <option value="force">Force</option>
                                                <option value="thunder">Thunder</option>
                                            </select>
                                            <button class="remove-damage-btn" style="display: none;">✖</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="damage-controls">
                                    <button id="addDamageBtn" class="add-damage-btn">+ Add Damage</button>
                                    <div class="damage-modifier">
                                        <label>Bonus:</label>
                                        <input type="number" id="damageModifier" value="0" min="-10" max="10">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group half">
                                <label>Properties:</label>
                                <div class="property-checkboxes">
                                    <label><input type="checkbox" class="property-checkbox" value="Finesse"> Finesse</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Heavy"> Heavy</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Light"> Light</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Loading"> Loading</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Reach"> Reach</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Special"> Special</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Thrown"> Thrown</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Two-Handed"> Two-Handed</label>
                                    <label><input type="checkbox" class="property-checkbox" value="Versatile"> Versatile</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="armorDetails" class="item-details-section" style="display: none;">
                        <h4>Armor Details</h4>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>Armor Class:</label>
                                <div class="structured-input">
                                    <input type="number" id="itemArmorClassBase" placeholder="Base AC" min="0" max="30">
                                    <select id="itemArmorClassMod">
                                        <option value="none">No Modifier</option>
                                        <option value="dex">+ Dex Modifier</option>
                                        <option value="dex_max_2">+ Dex Modifier (Max 2)</option>
                                        <option value="dex_max_3">+ Dex Modifier (Max 3)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group half">
                                <label>Stealth:</label>
                                <select id="itemStealth">
                                    <option value="none">Normal</option>
                                    <option value="disadvantage">Disadvantage</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group half">
                                <label>Strength Requirement:</label>
                                <input type="number" id="itemStrRequirement" placeholder="Minimum STR" min="0" max="30">
                            </div>
                        </div>
                    </div>
                    
                    <label>Effect (Optional):</label>
                    <div id="itemEffectsContainer"></div>
                    <button id="addItemEffectBtn" class="add-item-effect-btn">+ Add Effect</button>
                </div>
                <div class="modal-actions">
                    <button id="saveItemBtn" class="save-btn">Add to Inventory</button>
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
        // Modal tab switching
        document.getElementById("predefinedTabBtn").addEventListener("click", () => toggleItemTabs('predefined'));
        document.getElementById("customTabBtn").addEventListener("click", () => toggleItemTabs('custom'));
        
        // Search and filtering
        document.getElementById("predefinedSearch").addEventListener("input", filterPredefinedItems);
        document.getElementById("itemSearch").addEventListener("input", filterInventoryItems);
        document.getElementById("itemCategory").addEventListener("change", toggleItemDetails);
        
        // Add event listeners to filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', filterByCategory);
        });
        
        // Add event listener for add damage button
        setTimeout(() => {
            const addDamageBtn = document.getElementById("addDamageBtn");
            if (addDamageBtn) {
                addDamageBtn.addEventListener("click", () => addDamageRow());
            }
        }, 200);
        
        // Add event listeners to category filter buttons
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', filterPredefinedByCategory);
        });

        loadInventory();
        loadPredefinedItems();
    }, 100);

    let editingItemIndex = null;

    // Helper function to set select value if it exists in options
    function setSelectValueIfExists(selectElement, value) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === value) {
                selectElement.selectedIndex = i;
                return true;
            }
        }
        return false;
    }
    
    // Function to add a new damage row
    function addDamageRow(dice = null, type = null) {
        const container = document.getElementById("damageDiceContainer");
        const newRow = document.createElement("div");
        newRow.className = "damage-dice-row";
        
        newRow.innerHTML = `
            <div class="structured-input">
                <select class="item-damage-dice">
                    <option value="1d4">1d4</option>
                    <option value="1d6">1d6</option>
                    <option value="1d8">1d8</option>
                    <option value="1d10">1d10</option>
                    <option value="1d12">1d12</option>
                    <option value="2d4">2d4</option>
                    <option value="2d6">2d6</option>
                    <option value="2d8">2d8</option>
                    <option value="2d10">2d10</option>
                    <option value="2d12">2d12</option>
                    <option value="3d6">3d6</option>
                    <option value="3d8">3d8</option>
                    <option value="4d6">4d6</option>
                    <option value="4d8">4d8</option>
                    <option value="6d6">6d6</option>
                    <option value="8d6">8d6</option>
                    <option value="10d6">10d6</option>
                    <option value="12d6">12d6</option>
                </select>
                <select class="item-damage-type">
                    <option value="slashing">Slashing</option>
                    <option value="piercing">Piercing</option>
                    <option value="bludgeoning">Bludgeoning</option>
                    <option value="fire">Fire</option>
                    <option value="cold">Cold</option>
                    <option value="lightning">Lightning</option>
                    <option value="acid">Acid</option>
                    <option value="poison">Poison</option>
                    <option value="psychic">Psychic</option>
                    <option value="necrotic">Necrotic</option>
                    <option value="radiant">Radiant</option>
                    <option value="force">Force</option>
                    <option value="thunder">Thunder</option>
                </select>
                <button class="remove-damage-btn">✖</button>
            </div>
        `;
        
        // Set values if provided
        if (dice) {
            setSelectValueIfExists(newRow.querySelector('.item-damage-dice'), dice);
        }
        if (type) {
            setSelectValueIfExists(newRow.querySelector('.item-damage-type'), type);
        }
        
        // Add event listener to remove button
        newRow.querySelector('.remove-damage-btn').addEventListener('click', function() {
            newRow.remove();
            updateDamageRowButtons();
        });
        
        container.appendChild(newRow);
        updateDamageRowButtons();
    }
    
    // Function to update remove buttons visibility
    function updateDamageRowButtons() {
        const rows = document.querySelectorAll('.damage-dice-row');
        
        // Hide all remove buttons if there's only one row
        if (rows.length === 1) {
            rows[0].querySelector('.remove-damage-btn').style.display = 'none';
        } else {
            // Show all remove buttons
            rows.forEach(row => {
                row.querySelector('.remove-damage-btn').style.display = 'flex';
            });
        }
    }

    function openItemModal() {
        document.getElementById("itemModalTitle").textContent = "Add Item";
        // Reset form fields
        document.getElementById("itemName").value = "";
        document.getElementById("itemDescription").value = "";
        document.getElementById("itemValue").value = "";
        document.getElementById("itemWeight").value = "";
        document.getElementById("itemCategory").value = "misc";
        document.getElementById("itemQuantity").value = "1";
        document.getElementById("predefinedQuantity").value = "1";
        document.getElementById("itemEffectsContainer").innerHTML = "";
        
        // Reset damage rows to just one
        const damageContainer = document.getElementById("damageDiceContainer");
        if (damageContainer) {
            damageContainer.innerHTML = `
                <div class="damage-dice-row">
                    <div class="structured-input">
                        <select class="item-damage-dice">
                            <option value="1d4">1d4</option>
                            <option value="1d6">1d6</option>
                            <option value="1d8">1d8</option>
                            <option value="1d10">1d10</option>
                            <option value="1d12">1d12</option>
                            <option value="2d4">2d4</option>
                            <option value="2d6">2d6</option>
                            <option value="2d8">2d8</option>
                            <option value="2d10">2d10</option>
                            <option value="2d12">2d12</option>
                            <option value="3d6">3d6</option>
                            <option value="3d8">3d8</option>
                            <option value="4d6">4d6</option>
                            <option value="4d8">4d8</option>
                            <option value="6d6">6d6</option>
                            <option value="8d6">8d6</option>
                            <option value="10d6">10d6</option>
                            <option value="12d6">12d6</option>
                        </select>
                        <select class="item-damage-type">
                            <option value="slashing">Slashing</option>
                            <option value="piercing">Piercing</option>
                            <option value="bludgeoning">Bludgeoning</option>
                            <option value="fire">Fire</option>
                            <option value="cold">Cold</option>
                            <option value="lightning">Lightning</option>
                            <option value="acid">Acid</option>
                            <option value="poison">Poison</option>
                            <option value="psychic">Psychic</option>
                            <option value="necrotic">Necrotic</option>
                            <option value="radiant">Radiant</option>
                            <option value="force">Force</option>
                            <option value="thunder">Thunder</option>
                        </select>
                        <button class="remove-damage-btn" style="display: none;">✖</button>
                    </div>
                </div>
            `;
        }
        
        // Reset damage modifier
        if (document.getElementById("damageModifier")) {
            document.getElementById("damageModifier").value = "0";
        }
        
        // Show predefined tab by default
        document.getElementById("predefinedTabBtn").classList.add("active");
        document.getElementById("customTabBtn").classList.remove("active");
        document.getElementById("predefinedContainer").style.display = "flex";
        document.getElementById("customItemContainer").style.display = "none";
        
        // Reset item preview
        document.getElementById("previewName").textContent = "Select an item";
        document.getElementById("previewDetails").innerHTML = "";
        
        editingItemIndex = null;
        document.getElementById("itemModal").classList.remove("hidden");
    }

    function closeItemModal() {
        document.getElementById("itemModal").classList.add("hidden");
    }

    function toggleItemTabs(tab) {
        if (tab === 'predefined') {
            document.getElementById("predefinedTabBtn").classList.add("active");
            document.getElementById("customTabBtn").classList.remove("active");
            document.getElementById("predefinedContainer").style.display = "flex";
            document.getElementById("customItemContainer").style.display = "none";
            
            // Sync quantity
            const quantity = document.getElementById("itemQuantity").value;
            document.getElementById("predefinedQuantity").value = quantity;
        } else {
            document.getElementById("predefinedTabBtn").classList.remove("active");
            document.getElementById("customTabBtn").classList.add("active");
            document.getElementById("predefinedContainer").style.display = "none";
            document.getElementById("customItemContainer").style.display = "block";
            
            // Sync quantity
            const quantity = document.getElementById("predefinedQuantity").value;
            document.getElementById("itemQuantity").value = quantity;
            
            // Make sure subcategories are populated
            const category = document.getElementById("itemCategory").value;
            if (category) {
                toggleItemDetails();
            }
        }
    }

    function filterPredefinedItems() {
        const query = document.getElementById("predefinedSearch").value.toLowerCase();
        const activeCategory = document.querySelector('.category-filter.active').dataset.category;
        const select = document.getElementById("predefinedItemsSelect");
        
        // First hide/show optgroups based on category
        Array.from(select.children).forEach(optgroup => {
            const category = optgroup.label.toLowerCase();
            const shouldShowCategory = activeCategory === 'all' || 
                                      (activeCategory === 'weapon' && category.includes('weapon')) ||
                                      (activeCategory === 'armor' && category.includes('armor')) ||
                                      (activeCategory === 'clothing' && category.includes('clothing')) ||
                                      (activeCategory === 'misc' && !category.includes('weapon') && 
                                                                  !category.includes('armor') && 
                                                                  !category.includes('clothing'));
            
            if (shouldShowCategory) {
                optgroup.style.display = "";
                
                // Then filter options within visible optgroups
                Array.from(optgroup.children).forEach(option => {
                    if (option.text.toLowerCase().includes(query)) {
                        option.style.display = "";
                    } else {
                        option.style.display = "none";
                    }
                });
            } else {
                optgroup.style.display = "none";
            }
        });
    }
    
    function filterPredefinedByCategory(e) {
        // Update active button
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Filter items
        filterPredefinedItems();
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
    
    function getSubcategoryLabel(category, subcategory) {
        // Define subcategory mappings
        const subcategories = {
            'weapon': {
                'simple_melee': 'Simple Melee',
                'simple_ranged': 'Simple Ranged',
                'martial_melee': 'Martial Melee',
                'martial_ranged': 'Martial Ranged'
            },
            'armor': {
                'light_armor': 'Light Armor',
                'medium_armor': 'Medium Armor',
                'heavy_armor': 'Heavy Armor'
            },
            'shield': {
                'shields': 'Shield'
            },
            'clothing': {
                'head': 'Head',
                'neck': 'Neck',
                'shoulders': 'Shoulders',
                'chest': 'Chest',
                'back': 'Back',
                'wrists': 'Wrists',
                'hands': 'Hands',
                'waist': 'Waist',
                'legs': 'Legs',
                'feet': 'Feet',
                'finger': 'Finger'
            },
            'scroll': {
                'scrolls': 'Scroll'
            },
            'potion': {
                'potions': 'Potion'
            },
            'misc': {
                'equipment_packs': 'Equipment Pack',
                'tools': 'Tool',
                'artisan_tools': 'Artisan Tool',
                'musical_instruments': 'Musical Instrument',
                'gaming_sets': 'Gaming Set',
                'misc': 'Miscellaneous'
            },
            'wondrous': {
                'wondrous': 'Wondrous Item'
            }
        };
        
        if (subcategories[category] && subcategories[category][subcategory]) {
            return subcategories[category][subcategory];
        }
        
        // Return a formatted version of the subcategory if no mapping exists
        return subcategory.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
        const subcategorySelect = document.getElementById("itemSubcategory");
        
        // Hide all detail sections first
        document.querySelectorAll('.item-details-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Reset subcategory select
        subcategorySelect.innerHTML = '';
        
        // Populate subcategories based on category
        populateSubcategories(category, subcategorySelect);
        
        // Show the appropriate section based on category
        if (category === 'weapon') {
            document.getElementById('weaponDetails').style.display = 'block';
        } else if (category === 'armor') {
            document.getElementById('armorDetails').style.display = 'block';
        }
    }
    
    function populateSubcategories(category, selectElement) {
        selectElement.innerHTML = '<option value="">Loading subcategories...</option>';
        
        // Define subcategory mappings
        const subcategories = {
            'weapon': {
                'simple_melee': 'Simple Melee Weapons',
                'simple_ranged': 'Simple Ranged Weapons',
                'martial_melee': 'Martial Melee Weapons',
                'martial_ranged': 'Martial Ranged Weapons'
            },
            'armor': {
                'light_armor': 'Light Armor',
                'medium_armor': 'Medium Armor',
                'heavy_armor': 'Heavy Armor'
            },
            'clothing': {
                'head': 'Head',
                'neck': 'Neck',
                'shoulders': 'Shoulders',
                'chest': 'Chest',
                'back': 'Back',
                'wrists': 'Wrists',
                'hands': 'Hands',
                'waist': 'Waist',
                'legs': 'Legs',
                'feet': 'Feet',
                'finger': 'Finger'
            },
            'potion': {
                'healing': 'Healing Potion',
                'status': 'Status Effect Potion'
            },
            'misc': {
                'equipment_packs': 'Equipment Packs',
                'tools': 'Tools',
                'artisan_tools': 'Artisan Tools',
                'musical_instruments': 'Musical Instruments',
                'gaming_sets': 'Gaming Sets',
                'misc': 'Miscellaneous'
            }
        };
        
        selectElement.innerHTML = '';
        
        // Add subcategories based on the selected category
        if (subcategories[category]) {
            Object.entries(subcategories[category]).forEach(([value, label]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = label;
                selectElement.appendChild(option);
            });
        } else {
            // For categories without subcategories (shield, scroll, wondrous)
            const option = document.createElement('option');
            option.value = category;
            option.textContent = 'General';
            selectElement.appendChild(option);
        }
    }

    function loadPredefinedItems() {
        fetch("/static/items.json")
            .then(response => response.json())
            .then(data => {
                const predefinedItems = data.predefined_items || {};
                const customItems = data.custom_items || {};
                const select = document.getElementById("predefinedItemsSelect");
                select.innerHTML = "";
                
                // Create option groups for each category
                const categories = {
                    "Simple Melee Weapons": ["weapons.simple_melee"],
                    "Simple Ranged Weapons": ["weapons.simple_ranged"],
                    "Martial Melee Weapons": ["weapons.martial_melee"],
                    "Martial Ranged Weapons": ["weapons.martial_ranged"],
                    "Light Armor": ["armor.light_armor"],
                    "Medium Armor": ["armor.medium_armor"],
                    "Heavy Armor": ["armor.heavy_armor"],
                    "Shields": ["armor.shields"],
                    "Clothing - Head": ["clothing.head"],
                    "Clothing - Neck": ["clothing.neck"],
                    "Clothing - Shoulders": ["clothing.shoulders"],
                    "Clothing - Hands": ["clothing.hands"],
                    "Clothing - Waist": ["clothing.waist"],
                    "Clothing - Feet": ["clothing.feet"],
                    "Equipment Packs": ["adventuring_gear.equipment_packs"],
                    "Tools": ["adventuring_gear.tools"],
                    "Potions": ["adventuring_gear.potions"],
                    "Artisan Tools": ["adventuring_gear.artisan_tools"],
                    "Musical Instruments": ["adventuring_gear.musical_instruments"],
                    "Gaming Sets": ["adventuring_gear.gaming_sets"],
                    "Adventuring Gear": ["adventuring_gear.misc"]
                };
                
                // Store all items for preview functionality
                window.allPredefinedItems = {};
                
                // Create option groups and populate them
                Object.entries(categories).forEach(([groupName, paths]) => {
                    const optGroup = document.createElement("optgroup");
                    optGroup.label = groupName;
                    
                    // Process each path
                    paths.forEach(path => {
                        const pathParts = path.split('.');
                        let currentObj = predefinedItems;
                        
                        // Navigate to the correct object
                        for (const part of pathParts) {
                            if (!currentObj[part]) return;
                            currentObj = currentObj[part];
                        }
                        
                        // Process items in this category
                        Object.entries(currentObj).forEach(([itemKey, item]) => {
                            const fullKey = `${path}.${itemKey}`;
                            const option = document.createElement("option");
                            option.value = fullKey;
                            option.text = item.name;
                            optGroup.appendChild(option);
                            
                            // Store for preview
                            window.allPredefinedItems[fullKey] = item;
                        });
                        
                        // Add custom items to the appropriate category
                        Object.entries(customItems).forEach(([itemKey, item]) => {
                            // Check if this custom item belongs in this category
                            const itemCategory = item.category;
                            const itemSubcategory = item.subcategory;
                            
                            // Map category/subcategory to path
                            const categoryMap = {
                                'weapon': {
                                    'simple_melee': 'weapons.simple_melee',
                                    'simple_ranged': 'weapons.simple_ranged',
                                    'martial_melee': 'weapons.martial_melee',
                                    'martial_ranged': 'weapons.martial_ranged'
                                },
                                'armor': {
                                    'light_armor': 'armor.light_armor',
                                    'medium_armor': 'armor.medium_armor',
                                    'heavy_armor': 'armor.heavy_armor'
                                },
                                'shield': {
                                    'shields': 'armor.shields'
                                },
                                'clothing': {
                                    'head': 'clothing.head',
                                    'neck': 'clothing.neck',
                                    'shoulders': 'clothing.shoulders',
                                    'hands': 'clothing.hands',
                                    'waist': 'clothing.waist',
                                    'feet': 'clothing.feet'
                                },
                                'misc': {
                                    'equipment_packs': 'adventuring_gear.equipment_packs',
                                    'tools': 'adventuring_gear.tools',
                                    'misc': 'adventuring_gear.misc'
                                },
                                'potion': {
                                    'potions': 'adventuring_gear.potions'
                                }
                            };
                            
                            // Check if this item belongs in the current path
                            if (itemCategory && itemSubcategory && 
                                categoryMap[itemCategory] && 
                                categoryMap[itemCategory][itemSubcategory] === path) {
                                
                                const fullKey = `custom.${itemKey}`;
                                const option = document.createElement("option");
                                option.value = fullKey;
                                option.text = `${item.name} (Custom)`;
                                optGroup.appendChild(option);
                                
                                // Store for preview
                                window.allPredefinedItems[fullKey] = item;
                            }
                        });
                    });
                    
                    if (optGroup.children.length > 0) {
                        select.appendChild(optGroup);
                    }
                });
                
                // Add a separate section for custom items that don't fit elsewhere
                const customGroup = document.createElement("optgroup");
                customGroup.label = "Custom Items";
                let hasCustomItems = false;
                
                Object.entries(customItems).forEach(([itemKey, item]) => {
                    // Check if this item was already added to a specific category
                    const fullKey = `custom.${itemKey}`;
                    if (!window.allPredefinedItems[fullKey]) {
                        const option = document.createElement("option");
                        option.value = fullKey;
                        option.text = item.name;
                        customGroup.appendChild(option);
                        
                        // Store for preview
                        window.allPredefinedItems[fullKey] = item;
                        hasCustomItems = true;
                    }
                });
                
                if (hasCustomItems) {
                    select.appendChild(customGroup);
                }
                
                // Add event listener for item selection
                select.addEventListener('change', showItemPreview);
            })
            .catch(() => console.warn("Failed to load predefined items"));
    }
    
    function showItemPreview() {
        const select = document.getElementById("predefinedItemsSelect");
        const previewName = document.getElementById("previewName");
        const previewDetails = document.getElementById("previewDetails");
        
        if (select.value && window.allPredefinedItems[select.value]) {
            const item = window.allPredefinedItems[select.value];
            previewName.textContent = item.name;
            
            let detailsHtml = `<p class="preview-description">${item.description || ""}</p>`;
            
            if (item.damage) {
                detailsHtml += `<p class="preview-damage">Damage: ${item.damage}</p>`;
            }
            
            if (item.armor_class) {
                detailsHtml += `<p class="preview-ac">AC: ${item.armor_class}</p>`;
            }
            
            if (item.properties && item.properties.length > 0) {
                detailsHtml += `<p class="preview-properties">Properties: ${item.properties.join(', ')}</p>`;
            }
            
            detailsHtml += `
                <div class="preview-stats">
                    <span>Value: ${item.value} gp</span>
                    <span>Weight: ${item.weight} lb</span>
                </div>
            `;
            
            previewDetails.innerHTML = detailsHtml;
        } else {
            previewName.textContent = "Select an item";
            previewDetails.innerHTML = "";
        }
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
        
        // Add subcategory as a data attribute for filtering
        if (item.subcategory) {
            itemElement.dataset.subcategory = item.subcategory;
        }
        
        // Add subcategory as a data attribute for filtering
        if (item.subcategory) {
            itemElement.dataset.subcategory = item.subcategory;
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
                ${item.subcategory ? `<span>Type: ${getSubcategoryLabel(item.category, item.subcategory)}</span>` : ''}
            </div>
        `;
        
        // Add effects if any
        if (item.effect && item.effect.length > 0) {
            detailsHtml += `<div class="item-effects"><h5>Effects:</h5><ul>`;
            item.effect.forEach(effect => {
                let effectClass = "";
                let effectText = "";
                
                // Set appropriate styling based on effect category
                if (effect.category === "advantage") {
                    effectClass = "effect-advantage";
                    effectText = `Advantage on ${effect.target}`;
                } else if (effect.category === "disadvantage") {
                    effectClass = "effect-disadvantage";
                    effectText = `Disadvantage on ${effect.target}`;
                } else if (effect.category === "condition") {
                    effectClass = "effect-condition";
                    effectText = `Grants condition: ${effect.target}`;
                } else if (effect.category === "resistance") {
                    effectClass = "effect-resistance";
                    effectText = `Resistance to ${effect.target} damage`;
                } else if (effect.category === "immunity") {
                    effectClass = "effect-immunity";
                    effectText = `Immunity to ${effect.target} damage`;
                } else if (effect.category === "vulnerability") {
                    effectClass = "effect-vulnerability";
                    effectText = `Vulnerability to ${effect.target} damage`;
                } else if (effect.category === "proficiency") {
                    effectText = `Proficiency in ${effect.target}`;
                } else if (effect.category === "stat") {
                    effectText = `${effect.target}: ${effect.amount > 0 ? '+' : ''}${effect.amount}`;
                    if (effect.modifier === "per") {
                        effectText += ` per ${effect.perAmount} ${effect.perTarget}`;
                    }
                }
                
                detailsHtml += `<li class="${effectClass}">${effectText}</li>`;
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
            // Show predefined tab
            toggleItemTabs('predefined');
            
            // Set values
            document.getElementById("predefinedItemsSelect").value = item.predefinedKey;
            document.getElementById("predefinedQuantity").value = item.quantity || 1;
            
            // Show preview
            showItemPreview();
        } else {
            // Show custom tab
            toggleItemTabs('custom');
            
            // Basic item data
            document.getElementById("itemName").value = item.name;
            document.getElementById("itemDescription").value = item.description || "";
            document.getElementById("itemValue").value = item.value;
            document.getElementById("itemWeight").value = item.weight;
            document.getElementById("itemCategory").value = item.category || "misc";
            document.getElementById("itemQuantity").value = item.quantity || 1;
            
            // Trigger category-specific fields
            toggleItemDetails();
            
            // Set subcategory after toggleItemDetails populates the options
            setTimeout(() => {
                if (item.subcategory) {
                    const subcategorySelect = document.getElementById("itemSubcategory");
                    if (subcategorySelect) {
                        // Wait for options to be populated
                        const checkOptions = setInterval(() => {
                            if (subcategorySelect.options.length > 0) {
                                clearInterval(checkOptions);
                                
                                // Try to find the matching option
                                for (let i = 0; i < subcategorySelect.options.length; i++) {
                                    if (subcategorySelect.options[i].value === item.subcategory) {
                                        subcategorySelect.selectedIndex = i;
                                        break;
                                    }
                                }
                            }
                        }, 100);
                    }
                }
            }, 100);
            
            // Fill in category-specific data
            if (item.category === 'weapon') {
                // Clear existing damage rows except the first one
                document.querySelectorAll('.damage-dice-row:not(:first-child)').forEach(row => row.remove());
                
                // Parse damage string into parts (handling multiple damage types)
                if (item.damage) {
                    const allDamageParts = item.damage.split(' plus ');
                    let modifier = 0;
                    
                    // Process each damage part
                    allDamageParts.forEach((damagePart, index) => {
                        // Check for modifier in the first damage part
                        if (index === 0) {
                            const modMatch = damagePart.match(/([+-]\d+)$/);
                            if (modMatch) {
                                modifier = parseInt(modMatch[1]);
                                damagePart = damagePart.replace(/([+-]\d+)$/, '').trim();
                            }
                        }
                        
                        const parts = damagePart.trim().split(' ');
                        if (parts.length >= 2) {
                            const damageDice = parts[0];
                            const damageType = parts[1];
                            
                            // For first damage part, use the existing row
                            if (index === 0) {
                                const firstRow = document.querySelector('.damage-dice-row');
                                const diceSelect = firstRow.querySelector('.item-damage-dice');
                                const typeSelect = firstRow.querySelector('.item-damage-type');
                                
                                // Set values if they exist in the options
                                setSelectValueIfExists(diceSelect, damageDice);
                                setSelectValueIfExists(typeSelect, damageType);
                            } else {
                                // For additional damage parts, add new rows
                                addDamageRow(damageDice, damageType);
                            }
                        }
                    });
                    
                    // Set the damage modifier
                    document.getElementById("damageModifier").value = modifier;
                }
                
                // Show remove buttons if there are multiple damage rows
                updateDamageRowButtons();
                
                // Set properties checkboxes
                if (item.properties && Array.isArray(item.properties)) {
                    document.querySelectorAll('.property-checkbox').forEach(checkbox => {
                        checkbox.checked = item.properties.includes(checkbox.value);
                    });
                }
            } else if (item.category === 'armor') {
                // Parse armor class string
                if (item.armor_class) {
                    let baseAC = item.armor_class;
                    let acMod = 'none';
                    
                    if (item.armor_class.includes('+ Dex modifier (max 2)')) {
                        baseAC = item.armor_class.split('+')[0].trim();
                        acMod = 'dex_max_2';
                    } else if (item.armor_class.includes('+ Dex modifier (max 3)')) {
                        baseAC = item.armor_class.split('+')[0].trim();
                        acMod = 'dex_max_3';
                    } else if (item.armor_class.includes('+ Dex modifier')) {
                        baseAC = item.armor_class.split('+')[0].trim();
                        acMod = 'dex';
                    }
                    
                    document.getElementById("itemArmorClassBase").value = baseAC;
                    document.getElementById("itemArmorClassMod").value = acMod;
                }
                
                document.getElementById("itemStrRequirement").value = item.strength_requirement || "";
                document.getElementById("itemStealth").value = item.stealth === "Disadvantage" ? "disadvantage" : "none";
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
        const isPredefinedTab = document.getElementById("predefinedTabBtn").classList.contains("active");
        let itemData = {};
        if (isPredefinedTab) {
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
            itemData.subcategory = document.getElementById("itemSubcategory").value;
            itemData.quantity = parseInt(document.getElementById("itemQuantity").value) || 1;
            
            // Category-specific data
            if (itemData.category === 'weapon') {
                // Get all damage dice and types
                const damageParts = [];
                document.querySelectorAll('.damage-dice-row').forEach(row => {
                    const dice = row.querySelector('.item-damage-dice').value;
                    const type = row.querySelector('.item-damage-type').value;
                    damageParts.push(`${dice} ${type}`);
                });
                
                // Add modifier if not zero
                const modifier = parseInt(document.getElementById("damageModifier").value) || 0;
                if (modifier !== 0) {
                    damageParts[0] = `${damageParts[0]} ${modifier >= 0 ? '+' : ''}${modifier}`;
                }
                
                // Join all damage parts
                itemData.damage = damageParts.join(' plus ');
                
                // Get selected properties
                itemData.properties = [];
                document.querySelectorAll('.property-checkbox:checked').forEach(checkbox => {
                    itemData.properties.push(checkbox.value);
                });
            } else if (itemData.category === 'armor') {
                const baseAC = document.getElementById("itemArmorClassBase").value.trim();
                const acMod = document.getElementById("itemArmorClassMod").value;
                
                if (baseAC) {
                    if (acMod === 'none') {
                        itemData.armor_class = baseAC;
                    } else if (acMod === 'dex') {
                        itemData.armor_class = `${baseAC} + Dex modifier`;
                    } else if (acMod === 'dex_max_2') {
                        itemData.armor_class = `${baseAC} + Dex modifier (max 2)`;
                    } else if (acMod === 'dex_max_3') {
                        itemData.armor_class = `${baseAC} + Dex modifier (max 3)`;
                    }
                }
                
                const strReq = document.getElementById("itemStrRequirement").value.trim();
                if (strReq) {
                    itemData.strength_requirement = strReq;
                }
                
                const stealth = document.getElementById("itemStealth").value;
                if (stealth === 'disadvantage') {
                    itemData.stealth = "Disadvantage";
                }
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
        // First save to inventory
        fetch("/save_item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index: editingItemIndex, item: itemData }),
        }).then(() => {
            // If this is a custom item (not predefined), also save to custom items
            if (!itemData.predefined && itemData.name) {
                // Create a safe key from the item name
                const itemKey = itemData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                
                fetch("/save_custom_item", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: itemKey, item: itemData }),
                }).then(() => {
                    // Reload predefined items to include the new custom item
                    loadPredefinedItems();
                });
            }
            
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
        
        // Create a more structured layout with flex containers
        effectRow.innerHTML = `
            <div class="effect-main-row">
                <select class="effect-category">
                    <option value="stat" ${effect.category === "stat" ? "selected" : ""}>Stat</option>
                    <option value="proficiency" ${effect.category === "proficiency" ? "selected" : ""}>Proficiency</option>
                    <option value="advantage" ${effect.category === "advantage" ? "selected" : ""}>Advantage</option>
                    <option value="disadvantage" ${effect.category === "disadvantage" ? "selected" : ""}>Disadvantage</option>
                    <option value="condition" ${effect.category === "condition" ? "selected" : ""}>Condition</option>
                    <option value="resistance" ${effect.category === "resistance" ? "selected" : ""}>Resistance</option>
                    <option value="immunity" ${effect.category === "immunity" ? "selected" : ""}>Immunity</option>
                    <option value="vulnerability" ${effect.category === "vulnerability" ? "selected" : ""}>Vulnerability</option>
                </select>
                <select class="effect-target"></select>
                <input type="number" class="effect-amount" placeholder="Bonus" style="width: 80px;">
                <select class="effect-modifier">
                    <option value="none" ${effect.modifier === "none" ? "selected" : ""}>Flat</option>
                    <option value="per" ${effect.modifier === "per" ? "selected" : ""}>Per</option>
                </select>
                <button class="remove-effect-btn">✖</button>
            </div>
            <div class="per-container" style="display: none;">
                <div class="per-label">Per</div>
                <select class="effect-per-target"></select>
                <div class="per-label">Divide by</div>
                <input type="number" class="effect-per-amount" placeholder="Amount" style="width: 80px;" value="${effect.perAmount || 1}">
            </div>
        `;

        const categorySelect = effectRow.querySelector(".effect-category");
        const targetSelect = effectRow.querySelector(".effect-target");
        const amountField = effectRow.querySelector(".effect-amount");
        const modifierSelect = effectRow.querySelector(".effect-modifier");
        const perContainer = effectRow.querySelector(".per-container");
        const perTargetSelect = effectRow.querySelector(".effect-per-target");

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
        const ALL_CONDITIONS = [
            "Blinded", "Charmed", "Deafened", "Exhaustion", "Frightened", 
            "Grappled", "Incapacitated", "Invisible", "Paralyzed", "Petrified", 
            "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious"
        ];
        const ALL_DAMAGE_TYPES = [
            "Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", 
            "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"
        ];
        const ALL_ROLLS = [
            "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma",
            "Strength Save", "Dexterity Save", "Constitution Save", "Intelligence Save", "Wisdom Save", "Charisma Save",
            "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", 
            "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", 
            "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival",
            "Attack Rolls", "Melee Attack Rolls", "Ranged Attack Rolls", "Spell Attack Rolls"
        ];

        function updateFields() {
            if (categorySelect.value === "proficiency") {
                targetSelect.innerHTML = ALL_PROFICIENCIES.map(prof => `<option value="${prof}">${prof}</option>`).join("");
                amountField.style.display = "none";
                modifierSelect.style.display = "none";
                perContainer.style.display = "none";
            } else if (categorySelect.value === "advantage" || categorySelect.value === "disadvantage") {
                targetSelect.innerHTML = ALL_ROLLS.map(roll => `<option value="${roll}">${roll}</option>`).join("");
                amountField.style.display = "none";
                modifierSelect.style.display = "none";
                perContainer.style.display = "none";
            } else if (categorySelect.value === "condition") {
                targetSelect.innerHTML = ALL_CONDITIONS.map(cond => `<option value="${cond}">${cond}</option>`).join("");
                amountField.style.display = "none";
                modifierSelect.style.display = "none";
                perContainer.style.display = "none";
            } else if (["resistance", "immunity", "vulnerability"].includes(categorySelect.value)) {
                targetSelect.innerHTML = ALL_DAMAGE_TYPES.map(type => `<option value="${type}">${type}</option>`).join("");
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
            
            // Always populate the per-target dropdown with all stats
            perTargetSelect.innerHTML = ALL_STATS.map(stat => `<option value="${stat}">${stat}</option>`).join("");
            
            // Set selected values if provided
            if (effect.target) {
                targetSelect.value = effect.target;
            }
            if (effect.amount) {
                amountField.value = effect.amount;
            }
            if (effect.perTarget) {
                perTargetSelect.value = effect.perTarget;
            }
        }

        function updatePerFields() {
            perContainer.style.display = modifierSelect.value === "per" ? "flex" : "none";
        }

        categorySelect.addEventListener("change", updateFields);
        modifierSelect.addEventListener("change", updatePerFields);

        categorySelect.dispatchEvent(new Event("change"));
        
        // Set the modifier value and trigger the event after the fields are populated
        if (effect.modifier) {
            modifierSelect.value = effect.modifier;
        }
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
