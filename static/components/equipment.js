import { getFinalStat } from "../helpers.js";

export function populateEquipmentSection(containerElement, characterData) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <style>
            .equipment-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 10px;
            }
            .equipment-section {
                background: #222;
                border-radius: 5px;
                border: 1px solid #444;
                padding: 10px;
            }
            .equipment-section h3 {
                margin-top: 0;
                margin-bottom: 10px;
                border-bottom: 1px solid #444;
                padding-bottom: 5px;
            }
            .equipment-item {
                display: flex;
                align-items: center;
                padding: 8px;
                border-radius: 4px;
                margin-bottom: 5px;
                background: #333;
                border: 1px solid #555;
            }
            .equipment-item:hover {
                background: #3a3a3a;
            }
            .equipment-checkbox {
                margin-right: 10px;
                width: 18px;
                height: 18px;
            }
            .equipment-name {
                flex-grow: 1;
                font-weight: bold;
            }
            .equipment-details {
                color: #aaa;
                font-size: 0.9em;
                margin-left: 10px;
            }
            .equipment-category {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 0.8em;
                margin-left: 8px;
            }
            .category-weapon {
                background-color: rgba(231, 76, 60, 0.3);
                border: 1px solid rgba(231, 76, 60, 0.5);
            }
            .category-armor {
                background-color: rgba(52, 152, 219, 0.3);
                border: 1px solid rgba(52, 152, 219, 0.5);
            }
            .category-shield {
                background-color: rgba(52, 152, 219, 0.3);
                border: 1px solid rgba(52, 152, 219, 0.5);
            }
            .category-clothing {
                background-color: rgba(155, 89, 182, 0.3);
                border: 1px solid rgba(155, 89, 182, 0.5);
            }
            .category-misc {
                background-color: rgba(243, 156, 18, 0.3);
                border: 1px solid rgba(243, 156, 18, 0.5);
            }
            .no-items {
                color: #888;
                font-style: italic;
                text-align: center;
                padding: 10px;
            }
            .equipment-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }
            .stat-box {
                background: #333;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 8px 12px;
                flex: 1;
                min-width: 100px;
                text-align: center;
            }
            .stat-box strong {
                display: block;
                margin-bottom: 5px;
                color: #aaa;
            }
            .stat-value {
                font-size: 1.2em;
                font-weight: bold;
            }
            .use-item-btn {
                background-color: #4a6fa5;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8em;
                margin-left: 8px;
            }
            .use-item-btn:hover {
                background-color: #3a5f95;
            }
        </style>
        <div class="equipment-container">
            <div class="equipment-section">
                <h3>Equipped Items</h3>
                <div class="equipment-stats">
                    <div class="stat-box">
                        <strong>Armor Class</strong>
                        <div class="stat-value" id="equipped-ac">${getFinalStat("armor_class", characterData)}</div>
                    </div>
                    <div class="stat-box">
                        <strong>Weapon Damage</strong>
                        <div class="stat-value" id="equipped-damage">-</div>
                    </div>
                </div>
            </div>
            
            <div class="equipment-section">
                <h3>Weapons</h3>
                <div id="weapons-list"></div>
            </div>
            
            <div class="equipment-section">
                <h3>Armor & Shields</h3>
                <div id="armor-list"></div>
            </div>
            
            <div class="equipment-section">
                <h3>Clothing & Accessories</h3>
                <div id="clothing-list"></div>
            </div>
            
            <div class="equipment-section">
                <h3>Usable Items</h3>
                <div id="usable-list"></div>
            </div>
        </div>
    `;

    // Get inventory items from character data
    const inventory = characterData.inventory || [];
    const equipped = characterData.equipped || {};

    // Populate weapon list
    const weaponsList = containerElement.querySelector("#weapons-list");
    const weapons = inventory.filter(item => item.category === "weapon");
    
    if (weapons.length === 0) {
        weaponsList.innerHTML = '<div class="no-items">No weapons in inventory</div>';
    } else {
        weaponsList.innerHTML = '';
        weapons.forEach(weapon => {
            const isEquipped = equipped.weapon === weapon.name;
            const weaponItem = document.createElement("div");
            weaponItem.className = "equipment-item";
            weaponItem.innerHTML = `
                <input type="checkbox" class="equipment-checkbox" data-type="weapon" 
                       data-name="${weapon.name}" ${isEquipped ? 'checked' : ''}>
                <span class="equipment-name">${weapon.name}</span>
                <span class="equipment-details">${weapon.damage || ''}</span>
                <span class="equipment-category category-weapon">${getSubcategoryLabel(weapon.category, weapon.subcategory)}</span>
            `;
            weaponsList.appendChild(weaponItem);
            
            // Add event listener to toggle equipped status
            const checkbox = weaponItem.querySelector('.equipment-checkbox');
            checkbox.addEventListener('change', function() {
                toggleEquipped(this.dataset.type, this.dataset.name, this.checked);
            });
        });
    }
    
    // Populate armor list
    const armorList = containerElement.querySelector("#armor-list");
    const armors = inventory.filter(item => item.category === "armor" || item.category === "shield");
    
    if (armors.length === 0) {
        armorList.innerHTML = '<div class="no-items">No armor or shields in inventory</div>';
    } else {
        armorList.innerHTML = '';
        armors.forEach(armor => {
            const isEquipped = equipped.armor === armor.name || equipped.shield === armor.name;
            const armorItem = document.createElement("div");
            armorItem.className = "equipment-item";
            armorItem.innerHTML = `
                <input type="checkbox" class="equipment-checkbox" data-type="${armor.category}" 
                       data-name="${armor.name}" ${isEquipped ? 'checked' : ''}>
                <span class="equipment-name">${armor.name}</span>
                <span class="equipment-details">${armor.armor_class || ''}</span>
                <span class="equipment-category category-${armor.category}">${getSubcategoryLabel(armor.category, armor.subcategory)}</span>
            `;
            armorList.appendChild(armorItem);
            
            // Add event listener to toggle equipped status
            const checkbox = armorItem.querySelector('.equipment-checkbox');
            checkbox.addEventListener('change', function() {
                toggleEquipped(this.dataset.type, this.dataset.name, this.checked);
            });
        });
    }
    
    // Populate clothing list
    const clothingList = containerElement.querySelector("#clothing-list");
    const clothing = inventory.filter(item => item.category === "clothing");
    
    if (clothing.length === 0) {
        clothingList.innerHTML = '<div class="no-items">No clothing or accessories in inventory</div>';
    } else {
        clothingList.innerHTML = '';
        clothing.forEach(item => {
            const slot = item.subcategory || "misc";
            const isEquipped = equipped[slot] === item.name;
            const clothingItem = document.createElement("div");
            clothingItem.className = "equipment-item";
            clothingItem.innerHTML = `
                <input type="checkbox" class="equipment-checkbox" data-type="${slot}" 
                       data-name="${item.name}" ${isEquipped ? 'checked' : ''}>
                <span class="equipment-name">${item.name}</span>
                <span class="equipment-details">${getSubcategoryLabel(item.category, item.subcategory)}</span>
                <span class="equipment-category category-clothing">${item.subcategory || 'Accessory'}</span>
            `;
            clothingList.appendChild(clothingItem);
            
            // Add event listener to toggle equipped status
            const checkbox = clothingItem.querySelector('.equipment-checkbox');
            checkbox.addEventListener('change', function() {
                toggleEquipped(this.dataset.type, this.dataset.name, this.checked);
            });
        });
    }
    
    // Populate usable items list
    const usableList = containerElement.querySelector("#usable-list");
    const usableItems = inventory.filter(item => 
        item.category === "potion" || 
        item.category === "scroll" || 
        (item.category === "misc" && item.effect && item.effect.length > 0)
    );
    
    if (usableItems.length === 0) {
        usableList.innerHTML = '<div class="no-items">No usable items in inventory</div>';
    } else {
        usableList.innerHTML = '';
        usableItems.forEach(item => {
            const usableItem = document.createElement("div");
            usableItem.className = "equipment-item";
            usableItem.innerHTML = `
                <span class="equipment-name">${item.name}</span>
                <span class="equipment-details">Qty: ${item.quantity || 1}</span>
                <span class="equipment-category category-misc">${item.category}</span>
                <button class="use-item-btn" data-name="${item.name}">Use</button>
            `;
            usableList.appendChild(usableItem);
            
            // Add event listener for using the item
            const useBtn = usableItem.querySelector('.use-item-btn');
            useBtn.addEventListener('click', function() {
                useItem(this.dataset.name);
            });
        });
    }
    
    // Update equipped weapon damage display
    updateEquippedWeaponDisplay(characterData);
    
    // Helper function to get subcategory label
    function getSubcategoryLabel(category, subcategory) {
        if (!subcategory) return category;
        
        // Convert from snake_case to Title Case
        return subcategory.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    // Function to toggle equipped status
    function toggleEquipped(type, name, isEquipped) {
        fetch("/toggle_equipped", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                type: type,
                name: name,
                equipped: isEquipped
            }),
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI to reflect changes
                window.updateCharacterStats();
            }
        });
    }
    
    // Function to use an item
    function useItem(name) {
        // For now, just show an alert
        alert(`Used item: ${name}`);
        
        // In the future, this could apply temporary effects, reduce quantity, etc.
        // fetch("/use_item", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ name: name }),
        // }).then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         window.updateCharacterStats();
        //     }
        // });
    }
    
    // Function to update the equipped weapon display
    function updateEquippedWeaponDisplay(characterData) {
        const equippedDamageElement = containerElement.querySelector("#equipped-damage");
        const equipped = characterData.equipped || {};
        
        if (equipped.weapon) {
            const weapon = inventory.find(item => item.name === equipped.weapon);
            if (weapon && weapon.damage) {
                equippedDamageElement.textContent = weapon.damage;
            } else {
                equippedDamageElement.textContent = "-";
            }
        } else {
            equippedDamageElement.textContent = "-";
        }
    }
}
