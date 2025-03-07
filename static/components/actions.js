import { getFinalStat } from "../helpers.js";

export function populateActionsSection(containerElement, characterData) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <style>
            .actions-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 10px;
            }
            .action-section {
                background: #222;
                border-radius: 5px;
                border: 1px solid #444;
                padding: 10px;
            }
            .action-section h3 {
                margin-top: 0;
                margin-bottom: 10px;
                border-bottom: 1px solid #444;
                padding-bottom: 5px;
            }
            .action-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .action-item {
                display: flex;
                flex-direction: column;
                padding: 10px;
                border-radius: 4px;
                background: #333;
                border: 1px solid #555;
                transition: all 0.2s ease;
                text-align: center;
            }
            .action-item:hover {
                background: #3a3a3a;
                transform: translateY(-2px);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            .action-header {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 5px;
                gap: 10px;
            }
            .action-name {
                font-weight: bold;
                font-size: 1.1em;
            }
            .action-type {
                font-size: 0.8em;
                padding: 2px 6px;
                border-radius: 3px;
                background-color: rgba(74, 111, 165, 0.3);
                border: 1px solid rgba(74, 111, 165, 0.5);
            }
            .action-details {
                color: #aaa;
                font-size: 0.9em;
                margin-top: 5px;
                text-align: center;
            }
            .action-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 8px;
                justify-content: center;
            }
            .action-stat {
                font-size: 0.9em;
                padding: 3px 8px;
                border-radius: 3px;
                background-color: rgba(30, 30, 30, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .action-buttons {
                display: flex;
                gap: 8px;
                margin-top: 10px;
                justify-content: center;
            }
            .action-button {
                padding: 5px 10px;
                border-radius: 3px;
                background-color: #4a6fa5;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 0.9em;
                transition: background-color 0.2s;
            }
            .action-button:hover {
                background-color: #3a5f95;
            }
            .action-button.secondary {
                background-color: #555;
            }
            .action-button.secondary:hover {
                background-color: #444;
            }
            .no-actions {
                color: #888;
                font-style: italic;
                text-align: center;
                padding: 10px;
            }
            .action-type-attack {
                background-color: rgba(231, 76, 60, 0.3);
                border: 1px solid rgba(231, 76, 60, 0.5);
            }
            .action-type-spell {
                background-color: rgba(155, 89, 182, 0.3);
                border: 1px solid rgba(155, 89, 182, 0.5);
            }
            .action-type-item {
                background-color: rgba(243, 156, 18, 0.3);
                border: 1px solid rgba(243, 156, 18, 0.5);
            }
            .action-type-ability {
                background-color: rgba(52, 152, 219, 0.3);
                border: 1px solid rgba(52, 152, 219, 0.5);
            }
            .action-type-other {
                background-color: rgba(46, 204, 113, 0.3);
                border: 1px solid rgba(46, 204, 113, 0.5);
            }
            .dice-roller {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                margin-top: 15px;
                padding: 10px;
                background: #333;
                border-radius: 4px;
                border: 1px solid #555;
                justify-content: center;
            }
            .dice-input {
                display: flex;
                gap: 5px;
                align-items: center;
            }
            .dice-input select, .dice-input input {
                padding: 5px;
                background: #222;
                border: 1px solid #444;
                color: #e0e0e0;
                border-radius: 3px;
            }
            .dice-result {
                font-weight: bold;
                font-size: 1.1em;
                min-width: 80px;
                text-align: center;
            }
            .roll-button {
                padding: 5px 10px;
                background-color: #4a6fa5;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            .roll-button:hover {
                background-color: #3a5f95;
            }
            .roll-history {
                margin-top: 10px;
                max-height: 100px;
                overflow-y: auto;
                font-size: 0.9em;
                color: #aaa;
            }
            .roll-history-item {
                padding: 3px 0;
                border-bottom: 1px solid #444;
            }
            .roll-history-item:last-child {
                border-bottom: none;
            }
            .advantage-buttons {
                display: flex;
                gap: 5px;
            }
            .advantage-button {
                padding: 3px 6px;
                font-size: 0.8em;
                background: #333;
                border: 1px solid #555;
                border-radius: 3px;
                cursor: pointer;
            }
            .advantage-button.active {
                background-color: #4a6fa5;
                color: white;
            }
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: #222;
                padding: 20px;
                border-radius: 5px;
                max-width: 500px;
                width: 90%;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #444;
            }
            .modal-title {
                font-size: 1.2em;
                font-weight: bold;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                color: #aaa;
            }
            .modal-body {
                margin-bottom: 20px;
            }
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .hidden {
                display: none;
            }
        </style>
        <div class="actions-container">
            <div class="action-section">
                <h3>Weapon Actions</h3>
                <div id="weapon-actions" class="action-list"></div>
            </div>
            
            <div class="action-section">
                <h3>Item Actions</h3>
                <div id="item-actions" class="action-list"></div>
            </div>
            
            <div class="action-section">
                <h3>Basic Actions</h3>
                <div id="basic-actions" class="action-list"></div>
            </div>
            
            <div class="action-section">
                <h3>Dice Roller</h3>
                <div class="dice-roller">
                    <div class="dice-input">
                        <select id="dice-count">
                            ${Array.from({length: 10}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                        </select>
                        <select id="dice-type">
                            <option value="4">d4</option>
                            <option value="6">d6</option>
                            <option value="8">d8</option>
                            <option value="10">d10</option>
                            <option value="12">d12</option>
                            <option value="20" selected>d20</option>
                            <option value="100">d100</option>
                        </select>
                        <span>+</span>
                        <input type="number" id="dice-modifier" value="0" min="-20" max="20" style="width: 50px;">
                    </div>
                    <div class="advantage-buttons">
                        <button id="normal-roll" class="advantage-button active">Normal</button>
                        <button id="advantage-roll" class="advantage-button">Advantage</button>
                        <button id="disadvantage-roll" class="advantage-button">Disadvantage</button>
                    </div>
                    <button id="roll-button" class="roll-button">Roll</button>
                    <div id="dice-result" class="dice-result">-</div>
                </div>
                <div id="roll-history" class="roll-history"></div>
            </div>
        </div>
        
        <!-- Attack Roll Modal -->
        <div id="attack-modal" class="modal-overlay hidden">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Attack Roll</div>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="attack-details"></div>
                    <div class="advantage-buttons" style="margin: 15px 0;">
                        <button id="attack-normal" class="advantage-button active">Normal</button>
                        <button id="attack-advantage" class="advantage-button">Advantage</button>
                        <button id="attack-disadvantage" class="advantage-button">Disadvantage</button>
                    </div>
                    <div id="attack-result" style="margin-top: 15px; font-size: 1.2em;"></div>
                </div>
                <div class="modal-footer">
                    <button id="roll-attack" class="action-button">Roll Attack</button>
                    <button id="roll-damage" class="action-button" disabled>Roll Damage</button>
                    <button class="action-button secondary close-modal">Close</button>
                </div>
            </div>
        </div>
    `;

    // Get equipped items and other character data
    const equipped = characterData.equipped || {};
    const equipmentData = characterData.equipment_data || {};
    const inventory = characterData.inventory || [];
    
    console.log("Actions component - equipped items:", equipped);
    console.log("Actions component - equipment data:", equipmentData);
    
    // Calculate ability modifiers and other stats
    const strMod = Math.floor((getFinalStat("strength", characterData) - 10) / 2);
    const dexMod = Math.floor((getFinalStat("dexterity", characterData) - 10) / 2);
    const proficiencyBonus = getFinalStat("proficiency bonus", characterData);
    
    // Populate weapon actions
    const weaponActionsContainer = containerElement.querySelector("#weapon-actions");
    let hasWeaponActions = false;
    
    // Check for equipped weapons
    if (equipped.weapon) {
        hasWeaponActions = true;
        const weaponData = equipmentData[equipped.weapon] || {};
        const weaponItem = inventory.find(item => item.name === equipped.weapon);
        
        // Check if it's a weapon by category or if it has damage dice
        if (weaponItem && (
            weaponItem.category === "weapon" || 
            weaponData.category === "weapon" || 
            (weaponItem.damage && weaponItem.damage.includes("d")) ||
            (weaponData.damage && weaponData.damage.includes("d"))
        )) {
            // Determine if weapon uses Strength or Dexterity
            const properties = Array.isArray(weaponItem.properties) ? weaponItem.properties : [];
            const isFinesse = properties.includes("Finesse");
            const isThrowing = properties.includes("Thrown");
            const isRanged = weaponItem.subcategory && weaponItem.subcategory.includes("ranged");
            
            // Use the higher of Str or Dex for finesse weapons
            let attackMod = strMod;
            let attackStat = "Strength";
            
            if (isFinesse) {
                if (dexMod > strMod) {
                    attackMod = dexMod;
                    attackStat = "Dexterity";
                }
            } else if (isRanged) {
                attackMod = dexMod;
                attackStat = "Dexterity";
            }
            
            // Check if proficient with this weapon type
            const isProficient = true; // This would need to be determined based on character class/race/etc.
            const attackBonus = attackMod + (isProficient ? proficiencyBonus : 0);
            const attackBonusStr = attackBonus >= 0 ? `+${attackBonus}` : attackBonus;
            
            // Create the weapon attack action
            const weaponAction = document.createElement("div");
            weaponAction.className = "action-item";
            weaponAction.innerHTML = `
                <div class="action-header">
                    <span class="action-name">${weaponItem.name}</span>
                    <span class="action-type action-type-attack">Attack</span>
                </div>
                <div class="action-details">
                    ${weaponItem.damage || ""}
                </div>
                <div class="action-stats">
                    <span class="action-stat">Attack: ${attackBonusStr} (${attackStat})</span>
                    <span class="action-stat">Range: ${isRanged ? "Ranged" : "Melee"}</span>
                    ${Array.isArray(weaponItem.properties) && weaponItem.properties.length > 0 ? 
                      `<span class="action-stat">Properties: ${weaponItem.properties.join(", ")}</span>` : ""}
                </div>
                <div class="action-buttons">
                    <button class="action-button attack-button" data-weapon="${weaponItem.name}" data-bonus="${attackBonus}">Attack</button>
                </div>
            `;
            
            weaponActionsContainer.appendChild(weaponAction);
        }
    }
    
    // Check for offhand weapon
    if (equipped.offhand && equipped.offhand !== equipped.weapon) {
        hasWeaponActions = true;
        const offhandData = equipmentData[equipped.offhand] || {};
        const offhandItem = inventory.find(item => item.name === equipped.offhand);
        
        if (offhandItem && (
            offhandItem.category === "weapon" || 
            equipmentData[equipped.offhand]?.category === "weapon" ||
            (offhandItem.damage && offhandItem.damage.includes("d"))
        )) {
            // Determine if weapon uses Strength or Dexterity
            const properties = Array.isArray(offhandItem.properties) ? offhandItem.properties : [];
            const isFinesse = properties.includes("Finesse");
            const isThrowing = properties.includes("Thrown");
            const isRanged = offhandItem.subcategory && offhandItem.subcategory.includes("ranged");
            
            // Use the higher of Str or Dex for finesse weapons
            let attackMod = strMod;
            let attackStat = "Strength";
            
            if (isFinesse) {
                if (dexMod > strMod) {
                    attackMod = dexMod;
                    attackStat = "Dexterity";
                }
            } else if (isRanged) {
                attackMod = dexMod;
                attackStat = "Dexterity";
            }
            
            // Check if proficient with this weapon type
            const isProficient = true; // This would need to be determined based on character class/race/etc.
            const attackBonus = attackMod + (isProficient ? proficiencyBonus : 0);
            const attackBonusStr = attackBonus >= 0 ? `+${attackBonus}` : attackBonus;
            
            // Create the offhand weapon attack action
            const offhandAction = document.createElement("div");
            offhandAction.className = "action-item";
            offhandAction.innerHTML = `
                <div class="action-header">
                    <span class="action-name">${offhandItem.name} (Offhand)</span>
                    <span class="action-type action-type-attack">Attack</span>
                </div>
                <div class="action-details">
                    ${offhandItem.damage || ""}
                </div>
                <div class="action-stats">
                    <span class="action-stat">Attack: ${attackBonusStr} (${attackStat})</span>
                    <span class="action-stat">Range: ${isRanged ? "Ranged" : "Melee"}</span>
                    ${Array.isArray(offhandItem.properties) && offhandItem.properties.length > 0 ? 
                      `<span class="action-stat">Properties: ${offhandItem.properties.join(", ")}</span>` : ""}
                </div>
                <div class="action-buttons">
                    <button class="action-button attack-button" data-weapon="${offhandItem.name}" data-bonus="${attackBonus}">Attack</button>
                </div>
            `;
            
            weaponActionsContainer.appendChild(offhandAction);
        }
    }
    
    // If no weapons equipped, show message
    if (!hasWeaponActions) {
        weaponActionsContainer.innerHTML = '<div class="no-actions">No weapons equipped</div>';
    }
    
    // Populate item actions
    const itemActionsContainer = containerElement.querySelector("#item-actions");
    const usableItems = inventory.filter(item => 
        item.category === "potion" || 
        item.category === "scroll" || 
        (item.actions && item.actions.length > 0) ||
        (item.effect && item.effect.length > 0) ||
        (item.name && equipmentData[item.name]?.effect)
    );
    
    // Filter out weapons that are already shown in weapon actions
    const nonWeaponUsableItems = usableItems.filter(item => {
        // Skip if it's a weapon and already equipped (shown in weapon actions)
        if ((item.category === "weapon" || 
            (item.damage && item.damage.includes("d"))) && 
            (equipped.weapon === item.name || equipped.offhand === item.name)) {
            return false;
        }
        return true;
    });
    
    if (nonWeaponUsableItems.length === 0) {
        itemActionsContainer.innerHTML = '<div class="no-actions">No usable items in inventory</div>';
    } else {
        itemActionsContainer.innerHTML = '';
        nonWeaponUsableItems.forEach(item => {
            const itemAction = document.createElement("div");
            itemAction.className = "action-item";
            
            // Get effects from either the item or equipment_data
            const itemEffects = item.effect || equipmentData[item.name]?.effect || [];
            
            // Get custom actions if any
            const itemActions = item.actions || [];
            
            itemAction.innerHTML = `
                <div class="action-header">
                    <span class="action-name">${item.name}</span>
                    <span class="action-type action-type-item">${item.category}</span>
                </div>
                <div class="action-details">
                    ${item.description || ""}
                    ${itemEffects.length > 0 ? '<div class="item-effects"><strong>Effects:</strong> ' + 
                        itemEffects.map(e => `${e.category}: ${e.target} ${e.amount ? (e.amount > 0 ? '+' + e.amount : e.amount) : ''}`).join(', ') + 
                        '</div>' : ''}
                </div>
                <div class="action-stats">
                    <span class="action-stat">Quantity: ${item.quantity || 1}</span>
                    ${item.damage ? `<span class="action-stat">Damage: ${item.damage}</span>` : ''}
                    ${item.properties ? `<span class="action-stat">Properties: ${item.properties.join(', ')}</span>` : ''}
                </div>
                <div class="action-buttons">
                    ${itemActions && itemActions.length > 0 ? 
                        itemActions.map(action => 
                            `<button class="action-button custom-action-button" 
                                data-item="${item.name}" 
                                data-action-type="${action.actionType}" 
                                data-effect-type="${action.effectType}"
                                data-target="${action.target || ''}"
                                data-dice="${action.dice || ''}"
                                data-modifier="${action.modifier || 0}"
                                data-description="${action.description || ''}">
                                ${action.name || (action.actionType === 'action' ? 'Action' : 'Bonus Action')}
                            </button>`
                        ).join('') :
                        (item.category === "potion" || item.category === "scroll" || itemEffects.length > 0) ?
                        `<button class="action-button use-item-button" data-item="${item.name}">Use</button>` :
                        ''
                    }
                </div>
            `;
            
            itemActionsContainer.appendChild(itemAction);
        });
        
        // Add event listeners for custom action buttons
        containerElement.querySelectorAll(".custom-action-button").forEach(button => {
            button.addEventListener("click", () => {
                const itemName = button.dataset.item;
                const actionType = button.dataset.actionType;
                const effectType = button.dataset.effectType;
                const target = button.dataset.target;
                const dice = button.dataset.dice;
                const modifier = parseInt(button.dataset.modifier) || 0;
                const description = button.dataset.description;
                    
                // Create a modal for the action result
                const actionModal = document.createElement("div");
                actionModal.className = "modal-overlay";
                actionModal.style.zIndex = "2000"; // Ensure it's above other modals
                    
                let resultHtml = "";
                    
                // Handle different action types
                if (effectType === 'damage' || effectType === 'heal') {
                    // Roll damage/healing dice
                    if (dice) {
                        const [count, sides] = dice.split('d').map(Number);
                        const roll = rollDice(count, sides, modifier);
                            
                        let title = '';
                        let result = '';
                            
                        if (effectType === 'damage') {
                            title = `${itemName} - Damage`;
                            result = `<div style="font-size: 1.2em; text-align: center; margin-bottom: 10px;">
                                Deals <strong>${roll.total}</strong> damage${target ? ` (${target})` : ''}
                            </div>`;
                        } else {
                            title = `${itemName} - Healing`;
                            result = `<div style="font-size: 1.2em; text-align: center; margin-bottom: 10px;">
                                Heals for <strong>${roll.total}</strong> hit points
                            </div>`;
                        }
                            
                        resultHtml = `
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="modal-title">${title}</div>
                                    <button class="modal-close action-modal-close">&times;</button>
                                </div>
                                <div class="modal-body">
                                    ${result}
                                    <div style="color: #aaa; text-align: center;">
                                        Roll: [${roll.rolls.join(', ')}]${modifier ? ` + ${modifier}` : ''}
                                    </div>
                                    ${description ? `<div style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">${description}</div>` : ''}
                                </div>
                                <div class="modal-footer">
                                    <button class="action-button action-modal-close">Close</button>
                                </div>
                            </div>
                        `;
                    }
                } else if (effectType === 'status') {
                    resultHtml = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="modal-title">${itemName} - Status Effect</div>
                                <button class="modal-close action-modal-close">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div style="font-size: 1.2em; text-align: center; margin-bottom: 10px;">
                                    Applies <strong>${target}</strong> status effect
                                </div>
                                ${description ? `<div style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">${description}</div>` : ''}
                            </div>
                            <div class="modal-footer">
                                <button class="action-button action-modal-close">Close</button>
                            </div>
                        </div>
                    `;
                } else if (effectType === 'spell') {
                    resultHtml = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="modal-title">${itemName} - Cast Spell</div>
                                <button class="modal-close action-modal-close">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div style="font-size: 1.2em; text-align: center; margin-bottom: 10px;">
                                    Casts <strong>${target || 'a spell'}</strong>
                                </div>
                                ${description ? `<div style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">${description}</div>` : ''}
                            </div>
                            <div class="modal-footer">
                                <button class="action-button action-modal-close">Close</button>
                            </div>
                        </div>
                    `;
                } else {
                    resultHtml = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="modal-title">${itemName}</div>
                                <button class="modal-close action-modal-close">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div style="font-size: 1.2em; text-align: center; margin-bottom: 10px;">
                                    Item used
                                </div>
                                ${description ? `<div style="margin-top: 15px; border-top: 1px solid #444; padding-top: 10px;">${description}</div>` : 
                                '<div style="color: #888; text-align: center;">No description available</div>'}
                            </div>
                            <div class="modal-footer">
                                <button class="action-button action-modal-close">Close</button>
                            </div>
                        </div>
                    `;
                }
                    
                // Add the modal to the document
                actionModal.innerHTML = resultHtml;
                document.body.appendChild(actionModal);
                    
                // Add event listeners to close buttons
                actionModal.querySelectorAll(".action-modal-close").forEach(btn => {
                    btn.addEventListener("click", () => {
                        document.body.removeChild(actionModal);
                    });
                });
            });
        });
    }
    
    // Populate basic actions
    const basicActionsContainer = containerElement.querySelector("#basic-actions");
    const basicActions = [
        {
            name: "Dash",
            type: "Movement",
            description: "You gain extra movement for the current turn. The increase equals your speed, after applying any modifiers.",
            action: "action"
        },
        {
            name: "Disengage",
            type: "Movement",
            description: "Your movement doesn't provoke opportunity attacks for the rest of the turn.",
            action: "action"
        },
        {
            name: "Dodge",
            type: "Defense",
            description: "Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage.",
            action: "action"
        },
        {
            name: "Help",
            type: "Assistance",
            description: "The creature you help gains advantage on the next ability check it makes to perform the task you are helping with. Alternatively, you can aid a friendly creature in attacking a creature within 5 feet of you, giving advantage on the next attack roll.",
            action: "action"
        },
        {
            name: "Hide",
            type: "Stealth",
            description: "You make a Dexterity (Stealth) check in an attempt to hide.",
            action: "action"
        },
        {
            name: "Ready",
            type: "Preparation",
            description: "You prepare to use your action later in response to a specific trigger.",
            action: "action"
        },
        {
            name: "Search",
            type: "Perception",
            description: "You devote your attention to finding something. Depending on the nature of your search, the DM might have you make a Wisdom (Perception) check or an Intelligence (Investigation) check.",
            action: "action"
        },
        {
            name: "Use an Object",
            type: "Interaction",
            description: "You normally interact with an object while doing something else, such as drawing a sword as part of an attack. When an object requires your action for its use, you take the Use an Object action.",
            action: "action"
        },
        {
            name: "Grapple",
            type: "Combat",
            description: "You try to seize a creature or wrestle with it. Make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check.",
            action: "action"
        },
        {
            name: "Shove",
            type: "Combat",
            description: "You try to force a creature away from you or to the ground. Make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check.",
            action: "action"
        }
    ];
    
    basicActions.forEach(action => {
        const actionElement = document.createElement("div");
        actionElement.className = "action-item";
        actionElement.innerHTML = `
            <div class="action-header">
                <span class="action-name">${action.name}</span>
                <span class="action-type action-type-other">${action.type}</span>
            </div>
            <div class="action-details">
                ${action.description}
            </div>
            <div class="action-stats">
                <span class="action-stat">Action Type: ${action.action}</span>
            </div>
        `;
        
        basicActionsContainer.appendChild(actionElement);
    });
    
    // Set up dice roller
    const diceCountSelect = containerElement.querySelector("#dice-count");
    const diceTypeSelect = containerElement.querySelector("#dice-type");
    const diceModifierInput = containerElement.querySelector("#dice-modifier");
    const rollButton = containerElement.querySelector("#roll-button");
    const diceResult = containerElement.querySelector("#dice-result");
    const rollHistory = containerElement.querySelector("#roll-history");
    
    // Advantage/disadvantage buttons
    const normalRollBtn = containerElement.querySelector("#normal-roll");
    const advantageRollBtn = containerElement.querySelector("#advantage-roll");
    const disadvantageRollBtn = containerElement.querySelector("#disadvantage-roll");
    
    let rollMode = "normal";
    
    normalRollBtn.addEventListener("click", () => {
        rollMode = "normal";
        normalRollBtn.classList.add("active");
        advantageRollBtn.classList.remove("active");
        disadvantageRollBtn.classList.remove("active");
    });
    
    advantageRollBtn.addEventListener("click", () => {
        rollMode = "advantage";
        normalRollBtn.classList.remove("active");
        advantageRollBtn.classList.add("active");
        disadvantageRollBtn.classList.remove("active");
    });
    
    disadvantageRollBtn.addEventListener("click", () => {
        rollMode = "disadvantage";
        normalRollBtn.classList.remove("active");
        advantageRollBtn.classList.remove("active");
        disadvantageRollBtn.classList.add("active");
    });
    
    rollButton.addEventListener("click", () => {
        const count = parseInt(diceCountSelect.value);
        const type = parseInt(diceTypeSelect.value);
        const modifier = parseInt(diceModifierInput.value);
        
        let rollResult;
        let rollDetails = "";
        
        if (rollMode === "normal") {
            // Normal roll
            rollResult = rollDice(count, type, modifier);
            rollDetails = `${count}d${type}${modifier >= 0 ? '+' : ''}${modifier}`;
        } else if (rollMode === "advantage") {
            // Roll with advantage (twice, take higher)
            const roll1 = rollDice(count, type, 0);
            const roll2 = rollDice(count, type, 0);
            const baseResult = Math.max(roll1.total, roll2.total);
            rollResult = {
                rolls: [roll1, roll2],
                total: baseResult + modifier,
                details: `Advantage: [${roll1.rolls.join(', ')}] vs [${roll2.rolls.join(', ')}]`
            };
            rollDetails = `${count}d${type} with advantage${modifier >= 0 ? '+' : ''}${modifier}`;
        } else if (rollMode === "disadvantage") {
            // Roll with disadvantage (twice, take lower)
            const roll1 = rollDice(count, type, 0);
            const roll2 = rollDice(count, type, 0);
            const baseResult = Math.min(roll1.total, roll2.total);
            rollResult = {
                rolls: [roll1, roll2],
                total: baseResult + modifier,
                details: `Disadvantage: [${roll1.rolls.join(', ')}] vs [${roll2.rolls.join(', ')}]`
            };
            rollDetails = `${count}d${type} with disadvantage${modifier >= 0 ? '+' : ''}${modifier}`;
        }
        
        // Display result
        diceResult.textContent = rollResult.total;
        
        // Add to history
        const historyItem = document.createElement("div");
        historyItem.className = "roll-history-item";
        historyItem.textContent = `${rollDetails}: ${rollResult.total}`;
        rollHistory.prepend(historyItem);
        
        // Limit history to 10 items
        while (rollHistory.children.length > 10) {
            rollHistory.removeChild(rollHistory.lastChild);
        }
    });
    
    // Set up attack modal
    const attackModal = containerElement.querySelector("#attack-modal");
    const attackDetails = containerElement.querySelector("#attack-details");
    const attackResult = containerElement.querySelector("#attack-result");
    const rollAttackBtn = containerElement.querySelector("#roll-attack");
    const rollDamageBtn = containerElement.querySelector("#roll-damage");
    const closeModalBtns = containerElement.querySelectorAll(".close-modal, .modal-close");
    
    // Advantage/disadvantage buttons for attack
    const attackNormalBtn = containerElement.querySelector("#attack-normal");
    const attackAdvantageBtn = containerElement.querySelector("#attack-advantage");
    const attackDisadvantageBtn = containerElement.querySelector("#attack-disadvantage");
    
    let attackMode = "normal";
    let currentWeapon = null;
    let attackBonus = 0;
    
    attackNormalBtn.addEventListener("click", () => {
        attackMode = "normal";
        attackNormalBtn.classList.add("active");
        attackAdvantageBtn.classList.remove("active");
        attackDisadvantageBtn.classList.remove("active");
    });
    
    attackAdvantageBtn.addEventListener("click", () => {
        attackMode = "advantage";
        attackNormalBtn.classList.remove("active");
        attackAdvantageBtn.classList.add("active");
        attackDisadvantageBtn.classList.remove("active");
    });
    
    attackDisadvantageBtn.addEventListener("click", () => {
        attackMode = "disadvantage";
        attackNormalBtn.classList.remove("active");
        attackAdvantageBtn.classList.remove("active");
        attackDisadvantageBtn.classList.add("active");
    });
    
    // Add event listeners to attack buttons
    containerElement.querySelectorAll(".attack-button").forEach(button => {
        button.addEventListener("click", () => {
            currentWeapon = button.dataset.weapon;
            attackBonus = parseInt(button.dataset.bonus);
            
            // Find weapon data
            const weaponItem = inventory.find(item => item.name === currentWeapon);
            
            if (weaponItem) {
                // Populate attack details
                attackDetails.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <strong>${weaponItem.name}</strong>
                        <div>${weaponItem.damage || ""}</div>
                        <div>Attack Bonus: ${attackBonus >= 0 ? '+' : ''}${attackBonus}</div>
                    </div>
                `;
                
                // Reset attack result
                attackResult.innerHTML = "";
                
                // Enable attack roll button, disable damage roll button
                rollAttackBtn.disabled = false;
                rollDamageBtn.disabled = true;
                
                // Show modal
                attackModal.classList.remove("hidden");
            }
        });
    });
    
    // Roll attack button
    rollAttackBtn.addEventListener("click", () => {
        let attackRoll;
        
        if (attackMode === "normal") {
            // Normal attack roll
            attackRoll = rollDice(1, 20, attackBonus);
            attackResult.innerHTML = `
                <div>Attack Roll: ${attackRoll.total}</div>
                <div style="font-size: 0.9em; color: #aaa;">Roll: ${attackRoll.rolls[0]} + ${attackBonus}</div>
            `;
        } else if (attackMode === "advantage") {
            // Roll with advantage
            const roll1 = rollDice(1, 20, 0).rolls[0];
            const roll2 = rollDice(1, 20, 0).rolls[0];
            const baseResult = Math.max(roll1, roll2);
            attackRoll = {
                rolls: [roll1, roll2],
                total: baseResult + attackBonus
            };
            attackResult.innerHTML = `
                <div>Attack Roll (Advantage): ${attackRoll.total}</div>
                <div style="font-size: 0.9em; color: #aaa;">Rolls: ${roll1}, ${roll2} → ${baseResult} + ${attackBonus}</div>
            `;
        } else if (attackMode === "disadvantage") {
            // Roll with disadvantage
            const roll1 = rollDice(1, 20, 0).rolls[0];
            const roll2 = rollDice(1, 20, 0).rolls[0];
            const baseResult = Math.min(roll1, roll2);
            attackRoll = {
                rolls: [roll1, roll2],
                total: baseResult + attackBonus
            };
            attackResult.innerHTML = `
                <div>Attack Roll (Disadvantage): ${attackRoll.total}</div>
                <div style="font-size: 0.9em; color: #aaa;">Rolls: ${roll1}, ${roll2} → ${baseResult} + ${attackBonus}</div>
            `;
        }
        
        // Check for critical hit or miss
        if (attackRoll.rolls.includes(20)) {
            attackResult.innerHTML += `<div style="color: #2ecc71; font-weight: bold; margin-top: 5px;">Critical Hit!</div>`;
        } else if (attackRoll.rolls.includes(1)) {
            attackResult.innerHTML += `<div style="color: #e74c3c; font-weight: bold; margin-top: 5px;">Critical Miss!</div>`;
        }
        
        // Enable damage roll button
        rollDamageBtn.disabled = false;
    });
    
    // Roll damage button
    rollDamageBtn.addEventListener("click", () => {
        const weaponItem = inventory.find(item => item.name === currentWeapon);
        
        if (weaponItem && weaponItem.damage) {
            // Split damage string for multiple damage types (e.g., "1d8 slashing plus 1d6 fire")
            const damageParts = weaponItem.damage.split(" plus ");
            let totalDamage = 0;
            let allRolls = [];
            let damageDetails = "";
            
            damageParts.forEach((damagePart, index) => {
                // Parse each damage part (e.g., "1d8 slashing" or "1d6 fire")
                const damageMatch = damagePart.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?\s*(\w+)?/);
                
                if (damageMatch) {
                    const diceCount = parseInt(damageMatch[1]);
                    const diceType = parseInt(damageMatch[2]);
                    const damageBonus = damageMatch[3] ? parseInt(damageMatch[3]) : 0;
                    const damageType = damageMatch[4] || "";
                    
                    // Roll damage
                    const damageRoll = rollDice(diceCount, diceType, damageBonus);
                    totalDamage += damageRoll.total;
                    allRolls.push(...damageRoll.rolls);
                    
                    // Add to damage details
                    damageDetails += `
                        <div style="margin-top: 5px;">
                            <span style="color: #aaa;">${diceCount}d${diceType}${damageBonus ? ` + ${damageBonus}` : ''} ${damageType}:</span> 
                            ${damageRoll.total} <span style="color: #aaa;">[${damageRoll.rolls.join(', ')}${damageBonus ? ` + ${damageBonus}` : ''}]</span>
                        </div>
                    `;
                }
            });
            
            // Add to attack result
            attackResult.innerHTML += `
                <div style="margin-top: 10px; text-align: center;">
                    <div style="font-weight: bold; font-size: 1.1em;">Total Damage: ${totalDamage}</div>
                    ${damageDetails}
                </div>
            `;
        }
    });
    
    // Close modal buttons
    closeModalBtns.forEach(button => {
        button.addEventListener("click", () => {
            attackModal.classList.add("hidden");
        });
    });
    
    // Use item buttons
    containerElement.querySelectorAll(".use-item-button").forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.dataset.item;
            alert(`Used item: ${itemName}`);
            
            // In a real implementation, this would apply the item's effects
            // and potentially reduce its quantity or remove it from inventory
        });
    });
    
    // Helper function to roll dice
    function rollDice(count, sides, modifier = 0) {
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        return {
            rolls,
            total: total + modifier
        };
    }
}
