export function populateConditionsSection(containerElement, characterData) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <style>
            .conditions-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .condition-item {
                display: flex;
                align-items: center;
                background: #222;
                padding: 8px 12px;
                border-radius: 5px;
                border: 1px solid #444;
            }
            .condition-item.active {
                border-color: #e74c3c;
                background-color: rgba(231, 76, 60, 0.2);
            }
            .condition-item.resistance {
                border-color: #2ecc71;
                background-color: rgba(46, 204, 113, 0.2);
            }
            .condition-item.immunity {
                border-color: #f39c12;
                background-color: rgba(243, 156, 18, 0.2);
            }
            .condition-item.vulnerability {
                border-color: #9b59b6;
                background-color: rgba(155, 89, 182, 0.2);
            }
            .condition-checkbox {
                margin-right: 10px;
                width: 18px;
                height: 18px;
            }
            .condition-name {
                flex-grow: 1;
                font-weight: bold;
            }
            .condition-description {
                font-size: 0.9em;
                color: #aaa;
                margin-top: 5px;
                display: none;
            }
            .condition-item:hover .condition-description {
                display: block;
            }
            .conditions-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .conditions-title {
                font-size: 1.2em;
                font-weight: bold;
            }
            .condition-type {
                font-size: 0.8em;
                padding: 3px 6px;
                border-radius: 3px;
                margin-left: 8px;
            }
            .condition-type.active {
                background-color: rgba(231, 76, 60, 0.7);
            }
            .condition-type.resistance {
                background-color: rgba(46, 204, 113, 0.7);
            }
            .condition-type.immunity {
                background-color: rgba(243, 156, 18, 0.7);
            }
            .condition-type.vulnerability {
                background-color: rgba(155, 89, 182, 0.7);
            }
        </style>
        <div class="conditions-container">
            <div class="conditions-header">
                <div class="conditions-title">Conditions & Resistances</div>
            </div>
            <div id="conditionsList"></div>
        </div>
    `;

    // Define standard D&D conditions with descriptions
    const standardConditions = [
        { name: "Blinded", description: "You can't see. You automatically fail ability checks that require sight. Attack rolls against you have advantage, and your attack rolls have disadvantage." },
        { name: "Charmed", description: "You can't attack the charmer or target them with harmful abilities or magical effects. The charmer has advantage on ability checks to interact socially with you." },
        { name: "Deafened", description: "You can't hear. You automatically fail ability checks that require hearing." },
        { name: "Exhaustion", description: "Exhaustion has multiple levels, each with increasing penalties." },
        { name: "Frightened", description: "You have disadvantage on ability checks and attack rolls while the source of your fear is within line of sight. You can't willingly move closer to the source of your fear." },
        { name: "Grappled", description: "Your speed becomes 0, and you can't benefit from any bonus to your speed." },
        { name: "Incapacitated", description: "You can't take actions or reactions." },
        { name: "Invisible", description: "You are impossible to see without special senses. You have advantage on attack rolls, and attack rolls against you have disadvantage." },
        { name: "Paralyzed", description: "You are incapacitated and can't move or speak. You automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage. Any attack that hits you is a critical hit if the attacker is within 5 feet of you." },
        { name: "Petrified", description: "You are transformed into an inanimate substance. You are incapacitated, can't move or speak, and are unaware of your surroundings." },
        { name: "Poisoned", description: "You have disadvantage on attack rolls and ability checks." },
        { name: "Prone", description: "Your only movement option is to crawl. You have disadvantage on attack rolls. Attack rolls against you have advantage if the attacker is within 5 feet of you, otherwise they have disadvantage." },
        { name: "Restrained", description: "Your speed becomes 0. You have disadvantage on Dexterity saving throws. Attack rolls against you have advantage, and your attack rolls have disadvantage." },
        { name: "Stunned", description: "You are incapacitated, can't move, and can speak only falteringly. You automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage." },
        { name: "Unconscious", description: "You are incapacitated, can't move or speak, and are unaware of your surroundings. You drop whatever you're holding and fall prone. You automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage. Any attack that hits you is a critical hit if the attacker is within 5 feet of you." }
    ];

    // Define damage types for resistances/immunities/vulnerabilities
    const damageTypes = [
        { name: "Acid", description: "Damage type: Acid" },
        { name: "Bludgeoning", description: "Damage type: Bludgeoning" },
        { name: "Cold", description: "Damage type: Cold" },
        { name: "Fire", description: "Damage type: Fire" },
        { name: "Force", description: "Damage type: Force" },
        { name: "Lightning", description: "Damage type: Lightning" },
        { name: "Necrotic", description: "Damage type: Necrotic" },
        { name: "Piercing", description: "Damage type: Piercing" },
        { name: "Poison", description: "Damage type: Poison" },
        { name: "Psychic", description: "Damage type: Psychic" },
        { name: "Radiant", description: "Damage type: Radiant" },
        { name: "Slashing", description: "Damage type: Slashing" },
        { name: "Thunder", description: "Damage type: Thunder" }
    ];

    const conditionsList = containerElement.querySelector("#conditionsList");
    
    // Add standard conditions section
    const conditionsSection = document.createElement("div");
    conditionsSection.innerHTML = `<h4>Conditions</h4>`;
    conditionsList.appendChild(conditionsSection);
    
    standardConditions.forEach(condition => {
        const isActive = characterData.conditions && 
                         characterData.conditions.active && 
                         characterData.conditions.active.includes(condition.name);
        
        const conditionItem = document.createElement("div");
        conditionItem.className = `condition-item ${isActive ? 'active' : ''}`;
        conditionItem.innerHTML = `
            <input type="checkbox" class="condition-checkbox" data-condition="${condition.name}" 
                   data-type="active" ${isActive ? 'checked' : ''}>
            <span class="condition-name">${condition.name}</span>
            ${isActive ? '<span class="condition-type active">Active</span>' : ''}
            <div class="condition-description">${condition.description}</div>
        `;
        conditionsSection.appendChild(conditionItem);
        
        // Add event listener to toggle condition
        const checkbox = conditionItem.querySelector('.condition-checkbox');
        checkbox.addEventListener('change', function() {
            toggleCondition(this.dataset.condition, this.dataset.type, this.checked);
        });
    });
    
    // Add resistances section
    const resistancesSection = document.createElement("div");
    resistancesSection.innerHTML = `<h4>Damage Resistances</h4>`;
    conditionsList.appendChild(resistancesSection);
    
    damageTypes.forEach(damageType => {
        const hasResistance = characterData.conditions && 
                             characterData.conditions.resistances && 
                             characterData.conditions.resistances.includes(damageType.name);
        
        const resistanceItem = document.createElement("div");
        resistanceItem.className = `condition-item ${hasResistance ? 'resistance' : ''}`;
        resistanceItem.innerHTML = `
            <input type="checkbox" class="condition-checkbox" data-condition="${damageType.name}" 
                   data-type="resistance" ${hasResistance ? 'checked' : ''}>
            <span class="condition-name">${damageType.name}</span>
            ${hasResistance ? '<span class="condition-type resistance">Resistant</span>' : ''}
            <div class="condition-description">${damageType.description}</div>
        `;
        resistancesSection.appendChild(resistanceItem);
        
        // Add event listener to toggle resistance
        const checkbox = resistanceItem.querySelector('.condition-checkbox');
        checkbox.addEventListener('change', function() {
            toggleCondition(this.dataset.condition, this.dataset.type, this.checked);
        });
    });
    
    // Add immunities section
    const immunitiesSection = document.createElement("div");
    immunitiesSection.innerHTML = `<h4>Damage Immunities</h4>`;
    conditionsList.appendChild(immunitiesSection);
    
    damageTypes.forEach(damageType => {
        const hasImmunity = characterData.conditions && 
                           characterData.conditions.immunities && 
                           characterData.conditions.immunities.includes(damageType.name);
        
        const immunityItem = document.createElement("div");
        immunityItem.className = `condition-item ${hasImmunity ? 'immunity' : ''}`;
        immunityItem.innerHTML = `
            <input type="checkbox" class="condition-checkbox" data-condition="${damageType.name}" 
                   data-type="immunity" ${hasImmunity ? 'checked' : ''}>
            <span class="condition-name">${damageType.name}</span>
            ${hasImmunity ? '<span class="condition-type immunity">Immune</span>' : ''}
            <div class="condition-description">${damageType.description}</div>
        `;
        immunitiesSection.appendChild(immunityItem);
        
        // Add event listener to toggle immunity
        const checkbox = immunityItem.querySelector('.condition-checkbox');
        checkbox.addEventListener('change', function() {
            toggleCondition(this.dataset.condition, this.dataset.type, this.checked);
        });
    });
    
    // Add vulnerabilities section
    const vulnerabilitiesSection = document.createElement("div");
    vulnerabilitiesSection.innerHTML = `<h4>Damage Vulnerabilities</h4>`;
    conditionsList.appendChild(vulnerabilitiesSection);
    
    damageTypes.forEach(damageType => {
        const hasVulnerability = characterData.conditions && 
                                characterData.conditions.vulnerabilities && 
                                characterData.conditions.vulnerabilities.includes(damageType.name);
        
        const vulnerabilityItem = document.createElement("div");
        vulnerabilityItem.className = `condition-item ${hasVulnerability ? 'vulnerability' : ''}`;
        vulnerabilityItem.innerHTML = `
            <input type="checkbox" class="condition-checkbox" data-condition="${damageType.name}" 
                   data-type="vulnerability" ${hasVulnerability ? 'checked' : ''}>
            <span class="condition-name">${damageType.name}</span>
            ${hasVulnerability ? '<span class="condition-type vulnerability">Vulnerable</span>' : ''}
            <div class="condition-description">${damageType.description}</div>
        `;
        vulnerabilitiesSection.appendChild(vulnerabilityItem);
        
        // Add event listener to toggle vulnerability
        const checkbox = vulnerabilityItem.querySelector('.condition-checkbox');
        checkbox.addEventListener('change', function() {
            toggleCondition(this.dataset.condition, this.dataset.type, this.checked);
        });
    });
    
    // Function to toggle condition state
    function toggleCondition(conditionName, conditionType, isActive) {
        fetch("/toggle_condition", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                condition: conditionName,
                type: conditionType,
                active: isActive
            }),
        }).then(response => response.json())
        .then(data => {
            // Check if we need to update any related conditions
            if (data.updated) {
                // Update the UI to reflect the changes
                const checkboxes = document.querySelectorAll('.condition-checkbox');
                checkboxes.forEach(checkbox => {
                    const condition = checkbox.dataset.condition;
                    const type = checkbox.dataset.type;
                    
                    // Find the condition in the updated data
                    if (type === 'active' && data.conditions.active.includes(condition)) {
                        checkbox.checked = true;
                        checkbox.closest('.condition-item').classList.add('active');
                        if (!checkbox.closest('.condition-item').querySelector('.condition-type')) {
                            const typeSpan = document.createElement('span');
                            typeSpan.className = 'condition-type active';
                            typeSpan.textContent = 'Active';
                            checkbox.closest('.condition-item').querySelector('.condition-name').after(typeSpan);
                        }
                    } else if (type === 'resistance' && data.conditions.resistances.includes(condition)) {
                        checkbox.checked = true;
                        checkbox.closest('.condition-item').classList.add('resistance');
                        if (!checkbox.closest('.condition-item').querySelector('.condition-type')) {
                            const typeSpan = document.createElement('span');
                            typeSpan.className = 'condition-type resistance';
                            typeSpan.textContent = 'Resistant';
                            checkbox.closest('.condition-item').querySelector('.condition-name').after(typeSpan);
                        }
                    } else if (type === 'immunity' && data.conditions.immunities.includes(condition)) {
                        checkbox.checked = true;
                        checkbox.closest('.condition-item').classList.add('immunity');
                        if (!checkbox.closest('.condition-item').querySelector('.condition-type')) {
                            const typeSpan = document.createElement('span');
                            typeSpan.className = 'condition-type immunity';
                            typeSpan.textContent = 'Immune';
                            checkbox.closest('.condition-item').querySelector('.condition-name').after(typeSpan);
                        }
                    } else if (type === 'vulnerability' && data.conditions.vulnerabilities.includes(condition)) {
                        checkbox.checked = true;
                        checkbox.closest('.condition-item').classList.add('vulnerability');
                        if (!checkbox.closest('.condition-item').querySelector('.condition-type')) {
                            const typeSpan = document.createElement('span');
                            typeSpan.className = 'condition-type vulnerability';
                            typeSpan.textContent = 'Vulnerable';
                            checkbox.closest('.condition-item').querySelector('.condition-name').after(typeSpan);
                        }
                    } else if (type === conditionType && condition === conditionName) {
                        // This is the checkbox we just clicked, update its state
                        checkbox.checked = isActive;
                        if (isActive) {
                            checkbox.closest('.condition-item').classList.add(type);
                            if (!checkbox.closest('.condition-item').querySelector('.condition-type')) {
                                const typeSpan = document.createElement('span');
                                typeSpan.className = `condition-type ${type}`;
                                typeSpan.textContent = type === 'active' ? 'Active' : 
                                                      type === 'resistance' ? 'Resistant' :
                                                      type === 'immunity' ? 'Immune' : 'Vulnerable';
                                checkbox.closest('.condition-item').querySelector('.condition-name').after(typeSpan);
                            }
                        } else {
                            checkbox.closest('.condition-item').classList.remove(type);
                            const typeSpan = checkbox.closest('.condition-item').querySelector('.condition-type');
                            if (typeSpan) {
                                typeSpan.remove();
                            }
                        }
                    }
                });
            }
            
            window.updateCharacterStats(); // Refresh all calculated stats
        });
    }
}
