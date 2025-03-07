export function populateBonusesSection(containerElement) {
    if (!containerElement) return;

    let editingBonusIndex = null;

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

    containerElement.innerHTML = `
        <div class="bonuses-header">
            <button id="addBonusBtn" class="add-bonus-btn">+ Add Bonus</button>
        </div>
        <div id="bonusesList" class="bonuses-list"></div>

        <div id="bonusModal" class="modal hidden">
            <div class="modal-content">
                <h3 id="modalTitle">Add Bonus</h3>
                <label>Bonus Name:</label>
                <input type="text" id="bonusTitle">
                <label>Description (Optional):</label>
                <textarea id="bonusDescription"></textarea>

                <button id="addEffectBtn" class="add-effect-btn">+ Add Effect</button>
                <div id="effectsContainer"></div>

                <div class="modal-actions">
                    <button id="saveBonusBtn" class="save-btn">Save</button>
                    <button id="closeBonusBtn" class="close-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById("addBonusBtn").addEventListener("click", openModal);
        document.getElementById("closeBonusBtn").addEventListener("click", closeModal);
        document.getElementById("saveBonusBtn").addEventListener("click", saveBonus);
        document.getElementById("addEffectBtn").addEventListener("click", () => addEffectRow());

        loadBonuses();
    }, 100);

    function openModal() {
        document.getElementById("modalTitle").textContent = "Add Bonus";
        document.getElementById("bonusTitle").value = "";
        document.getElementById("bonusDescription").value = "";
        document.getElementById("effectsContainer").innerHTML = "";
        editingBonusIndex = null;
        document.getElementById("bonusModal").classList.remove("hidden");

        ensureAddEffectButton();
    }

    function ensureAddEffectButton() {
        let addEffectBtn = document.getElementById("addEffectBtn");
        const container = document.getElementById("effectsContainer");

        if (!addEffectBtn) {
            addEffectBtn = document.createElement("button");
            addEffectBtn.id = "addEffectBtn";
            addEffectBtn.classList.add("add-effect-btn");
            addEffectBtn.textContent = "+ Add Effect";
            addEffectBtn.addEventListener("click", () => addEffectRow());
        }

        container.appendChild(addEffectBtn);
    }

    function closeModal() {
        document.getElementById("bonusModal").classList.add("hidden");
    }

    function saveBonus() {
        const title = document.getElementById("bonusTitle").value.trim();
        const description = document.getElementById("bonusDescription").value.trim();
        if (!title) {
            alert("Bonus must have a title.");
            return;
        }

        const effects = [];
        document.querySelectorAll(".effect-row").forEach(row => {
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

            // Special case: If the stat is Health, apply to both max and current HP
            if (target.toLowerCase() === "health") {
                effects.push({ ...effectData, target: "hit_points_max" });
                effects.push({ ...effectData, target: "hit_points_current" });
            } else {
                effects.push(effectData);
            }
        });

        const bonusData = { title, description: description || undefined, effects };

        fetch("/save_bonus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index: editingBonusIndex, bonus: bonusData }),
        }).then(() => {
            loadBonuses();
            window.updateCharacterStats(); // Refresh all calculated stats
        });

        closeModal();
    }

    function loadBonuses() {
        fetch("/static/data.json")
            .then(response => response.json())
            .then(data => {
                const bonusesList = document.getElementById("bonusesList");
                bonusesList.innerHTML = "";
                if (!data.bonuses) return;

                data.bonuses.forEach(({ title, description, effects }, index) => {
                    addBonusToList(title, description, effects, index);
                });
            })
            .catch(() => console.warn("Failed to load bonuses from data.json"));
    }

    function addBonusToList(title, description, effects, index) {
        const bonusesList = document.getElementById("bonusesList");
        const bonusItem = document.createElement("div");
        bonusItem.classList.add("bonus-item");
        bonusItem.dataset.effects = JSON.stringify(effects);
        bonusItem.innerHTML = `
            <h3>${title}</h3>
            ${description ? `<p>${description}</p>` : ""}
            <div class="bonus-actions">
                <button class="edit-bonus">Edit</button>
                <button class="remove-bonus">Remove</button>
            </div>
        `;

        bonusesList.appendChild(bonusItem);

        bonusItem.querySelector(".edit-bonus").addEventListener("click", () => editBonus(index, title, description, effects));
        bonusItem.querySelector(".remove-bonus").addEventListener("click", () => removeBonus(index));
    }

    function editBonus(index, title, description, effects) {
        document.getElementById("modalTitle").textContent = "Edit Bonus";
        document.getElementById("bonusTitle").value = title;
        document.getElementById("bonusDescription").value = description || "";
        document.getElementById("effectsContainer").innerHTML = "";
        editingBonusIndex = index;

        // Filter out duplicate effects (like Health -> hit_points_max/current)
        const uniqueEffects = effects.filter(effect => 
            !(effect.target === "hit_points_max" || effect.target === "hit_points_current") ||
            effect.target === "hit_points_max"
        );
        
        uniqueEffects.forEach(effect => {
            // Convert hit_points_max back to Health for editing
            if (effect.target === "hit_points_max") {
                const healthEffect = {...effect, target: "Health"};
                addEffectRow(healthEffect);
            } else {
                addEffectRow(effect);
            }
        });
        
        document.getElementById("bonusModal").classList.remove("hidden");
    }

    function removeBonus(index) {
        fetch("/remove_bonus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index }),
        }).then(() => {
            loadBonuses();
            window.updateCharacterStats(); // Refresh all calculated stats
        });
    }

    function addEffectRow(effect = {}) {
        const container = document.getElementById("effectsContainer");

        const effectRow = document.createElement("div");
        effectRow.classList.add("effect-row");
        effectRow.innerHTML = `
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
        <input type="number" class="effect-amount" placeholder="Flat Bonus" style="width: 100px;">
        <select class="effect-modifier">
            <option value="none" ${effect.modifier === "none" ? "selected" : ""}>None</option>
            <option value="per" ${effect.modifier === "per" ? "selected" : ""}>Per</option>
        </select>
        <div class="per-container" style="display: none;">
            <select class="effect-per-target">${ALL_STATS.map(stat => `<option value="${stat}">${stat}</option>`).join("")}</select>
            <input type="number" class="effect-per-amount" placeholder="Per amount" style="width: 100px;">
        </div>
        <button class="remove-effect-btn">✖</button>
    `;

        const categorySelect = effectRow.querySelector(".effect-category");
        const targetSelect = effectRow.querySelector(".effect-target");
        const amountField = effectRow.querySelector(".effect-amount");
        const modifierSelect = effectRow.querySelector(".effect-modifier");
        const perContainer = effectRow.querySelector(".per-container");

        // Function to update visibility based on category
        function updateFields() {
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
            
            if (categorySelect.value === "proficiency") {
                targetSelect.innerHTML = ALL_PROFICIENCIES.map(prof => `<option value="${prof}">${prof}</option>`).join("");
                amountField.style.display = "none"; // Hide amount for proficiency
                modifierSelect.style.display = "none";
                perContainer.style.display = "none"; // Hide "per" section
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
                amountField.style.display = "inline-block"; // Show amount for stats
                modifierSelect.style.display = "inline-block";
                updatePerFields();
            }
        }

        // Update per-section visibility
        function updatePerFields() {
            perContainer.style.display = modifierSelect.value === "per" ? "inline-block" : "none";
        }

        // Attach event listeners
        categorySelect.addEventListener("change", updateFields);
        modifierSelect.addEventListener("change", updatePerFields);

        // Initialize with correct values
        categorySelect.dispatchEvent(new Event("change"));
        modifierSelect.dispatchEvent(new Event("change"));

        // Add event listener to remove button
        effectRow.querySelector(".remove-effect-btn").addEventListener("click", () => {
            effectRow.remove();
            moveAddEffectButton();
        });

        container.appendChild(effectRow);
        moveAddEffectButton();
    }

    function moveAddEffectButton() {
        let addEffectBtn = document.getElementById("addEffectBtn");
        const container = document.getElementById("effectsContainer");

        if (!addEffectBtn) {
            addEffectBtn = document.createElement("button");
            addEffectBtn.id = "addEffectBtn";
            addEffectBtn.classList.add("add-effect-btn");
            addEffectBtn.textContent = "+ Add Effect";
            addEffectBtn.addEventListener("click", () => addEffectRow());
        }

        container.appendChild(addEffectBtn);
    }
}
