// helpers.js

export function calculateModifier(score, bool) {
    const mod = Math.floor((score - 10) / 2);
    return bool === true ? (mod < 0 ? mod : "+" + mod) : mod;
}

export function getProficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2; // Standard D&D progression
}

export function generateDeathSaves(count) {
    return `
        ${[...Array(3)].map((_, i) => `<input type="checkbox" ${i < count ? "checked" : ""} disabled>`).join("")}
    `;
}

export function getFinalStat(statName, characterData) {
    // Ensure statName is always a string
    if (typeof statName !== "string") {
        console.warn("getFinalStat() received a non-string statName:", statName);
        return 0; // Default to 0 to avoid errors
    }

    statName = statName.toLowerCase(); // Now safe to use .toLowerCase()

    // Function to safely access properties
    function getProperty(obj, key) {
        return obj && obj[key] !== undefined ? obj[key] : 0;
    }

    // Special case for armor class calculation
    if (statName === "armor_class") {
        return calculateArmorClass(characterData);
    }

    // Determine base value directly from characterData
    let baseValue = getProperty(characterData, statName) ||
                    getProperty(characterData.combat_stats, statName) ||
                    getProperty(characterData.ability_scores, statName);

    // Apply bonuses from character bonuses
    if (characterData.bonuses) {
        characterData.bonuses.forEach(bonus => {
            if (!bonus.effects) return;
            
            bonus.effects.forEach(effect => {
                let effectTarget = effect.target.toLowerCase();

                if (effect.category === "stat" && effectTarget === statName) {
                    if (effect.modifier === "none" || !effect.modifier) {
                        baseValue += effect.amount || 0;
                    } else if (effect.modifier === "per") {
                        let perStat = getFinalStat(effect.perTarget, characterData);
                        baseValue += Math.floor(perStat / effect.perAmount) * effect.amount;
                    }
                }
            });
        });
    }
    
    // Apply bonuses from equipped items
    if (characterData.equipped && characterData.inventory) {
        const equipped = characterData.equipped;
        
        // Check each equipped slot
        for (const slot in equipped) {
            if (!equipped[slot]) continue; // Skip empty slots
            
            // Find the equipped item in inventory
            const item = characterData.inventory.find(item => item.name === equipped[slot]);
            
            if (item && item.effect) {
                // Apply each effect from the item
                item.effect.forEach(effect => {
                    let effectTarget = effect.target.toLowerCase();
                    
                    if (effect.category === "stat" && effectTarget === statName) {
                        if (effect.modifier === "none" || !effect.modifier) {
                            baseValue += effect.amount || 0;
                        } else if (effect.modifier === "per") {
                            let perStat = getFinalStat(effect.perTarget, characterData);
                            baseValue += Math.floor(perStat / effect.perAmount) * effect.amount;
                        }
                    }
                });
            }
        }
    }

    return baseValue;
}

/**
 * Calculates armor class based on equipped armor and dexterity
 * @param {Object} characterData - The full character data
 * @returns {number} - The calculated armor class
 */
function calculateArmorClass(characterData) {
    const equipped = characterData.equipped || {};
    const dexModifier = calculateModifier(getFinalStat("dexterity", characterData), false);
    
    // Start with base AC (10 + DEX modifier)
    let finalAC = 10 + dexModifier;
    
    // Check if armor is equipped
    if (equipped.armor) {
        // Find the armor in inventory
        const armor = characterData.inventory.find(item => 
            item.name === equipped.armor && item.category === "armor"
        );
        
        if (armor && armor.armor_class) {
            // Parse the armor class string
            let baseAC = 10;
            let maxDexMod = null;
            
            if (typeof armor.armor_class === "string") {
                // Extract base AC value
                const acMatch = armor.armor_class.match(/^(\d+)/);
                if (acMatch) {
                    baseAC = parseInt(acMatch[1]);
                }
                
                // Check for dex modifier limitations
                if (armor.armor_class.includes("max 2")) {
                    maxDexMod = 2;
                } else if (armor.armor_class.includes("max 3")) {
                    maxDexMod = 3;
                } else if (!armor.armor_class.includes("Dex modifier")) {
                    // Heavy armor doesn't add dex
                    maxDexMod = 0;
                }
            } else if (typeof armor.armor_class === "number") {
                baseAC = armor.armor_class;
            }
            
            // Calculate armor AC with dex modifier (if applicable)
            finalAC = baseAC;
            if (maxDexMod !== 0) {
                if (maxDexMod !== null) {
                    // Limited dex bonus
                    finalAC += Math.min(dexModifier, maxDexMod);
                } else {
                    // Full dex bonus
                    finalAC += dexModifier;
                }
            }
        }
    }
    
    // Add shield bonus if equipped
    if (equipped.shield) {
        const shield = characterData.inventory.find(item => 
            item.name === equipped.shield && item.category === "shield"
        );
        
        if (shield && shield.armor_class) {
            // Extract shield AC bonus
            const shieldACMatch = shield.armor_class.match(/\+(\d+)/);
            if (shieldACMatch) {
                finalAC += parseInt(shieldACMatch[1]);
            } else if (typeof shield.armor_class === "number") {
                finalAC += shield.armor_class;
            }
        }
    }
    
    // Add AC bonuses from other equipped items
    for (const slot in equipped) {
        if (equipped[slot] && slot !== 'armor' && slot !== 'shield') {
            const item = characterData.inventory.find(item => 
                item.name === equipped[slot]
            );
            
            if (item && item.effect) {
                item.effect.forEach(effect => {
                    if (effect.category === "stat" && effect.target === "Armor Class") {
                        finalAC += effect.amount || 0;
                    }
                });
            }
        }
    }
    
    return finalAC;
}

/**
 * Calculates the final proficiency bonus after applying all relevant bonuses.
 * @param {Object} characterData - The full JSON character data.
 * @returns {number} - The final calculated proficiency bonus.
 */
export function getFinalProficiencyBonus(characterData) {
    let finalBonus = getProficiencyBonus(characterData.player_info.level); // Base proficiency bonus

    // Apply bonuses that affect proficiency bonus
    characterData.bonuses.forEach(bonus => {
        bonus.effects.forEach(effect => {
            if (effect.category === "stat" && effect.target.toLowerCase() === "proficiency bonus") {
                if (effect.modifier === "none") {
                    finalBonus += effect.amount; // Direct bonus
                } else if (effect.modifier === "per") {
                    let perStat = getFinalStat(effect.perTarget, characterData);
                    finalBonus += Math.floor(perStat / effect.perAmount) * effect.amount; // Scaling bonus
                }
            }
        });
    });

    return finalBonus;
}

/**
 * Determines if the character has proficiency in a given skill or saving throw.
 * @param {string} proficiencyName - The skill or save to check.
 * @param {Object} characterData - The full JSON character data.
 * @returns {boolean} - True if the character has proficiency, false otherwise.
 */
export function hasProficiency(proficiencyName, characterData) {
    // Normalize the proficiency name for case-insensitive comparison
    const normalizedName = proficiencyName.toLowerCase();
    
    // Check saving throws
    if (characterData.saving_throws[normalizedName] === true) {
        return true;
    }

    // Check skill proficiencies
    for (let skill of characterData.skills) {
        if (skill.name.toLowerCase() === normalizedName && skill.proficient) {
            return true;
        }
    }

    // Check bonuses that grant proficiency
    if (characterData.bonuses) {
        for (let bonus of characterData.bonuses) {
            if (!bonus.effects) continue;
            
            for (let effect of bonus.effects) {
                if (effect.category === "proficiency" && 
                    effect.target.toLowerCase() === normalizedName) {
                    return true;
                }
            }
        }
    }
    
    // Check inventory items that grant proficiency
    if (characterData.inventory) {
        for (let item of characterData.inventory) {
            if (item.effect) {
                for (let effect of item.effect) {
                    if (effect.category === "proficiency" && 
                        effect.target.toLowerCase() === normalizedName) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

/**
 * Determines if the character has advantage on a given roll.
 * @param {string} rollName - The roll to check (skill, save, etc).
 * @param {Object} characterData - The full JSON character data.
 * @returns {string} - "advantage", "disadvantage", or "normal"
 */
export function getRollAdvantage(rollName, characterData) {
    let hasAdvantage = false;
    let hasDisadvantage = false;
    
    // Normalize the roll name
    const normalizedRollName = rollName.toLowerCase();
    
    // Check for general roll categories that might match
    const isAttackRoll = normalizedRollName.includes("attack");
    const isAbilityCheck = !normalizedRollName.includes("save") && 
                          ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].some(
                              ability => normalizedRollName.includes(ability)
                          );
    const isMeleeAttack = normalizedRollName.includes("melee") || normalizedRollName.includes("strength");
    const isRangedAttack = normalizedRollName.includes("ranged") || normalizedRollName.includes("dexterity");
    
    // Check bonuses for advantage/disadvantage effects
    if (characterData.bonuses) {
        for (let bonus of characterData.bonuses) {
            if (!bonus.effects) continue;
            
            for (let effect of bonus.effects) {
                // Check for direct matches
                if (effect.category === "advantage" && 
                    effect.target.toLowerCase() === normalizedRollName) {
                    hasAdvantage = true;
                }
                if (effect.category === "disadvantage" && 
                    effect.target.toLowerCase() === normalizedRollName) {
                    hasDisadvantage = true;
                }
                
                // Check for category matches (Attack Rolls, etc)
                if (effect.category === "advantage") {
                    const effectTarget = effect.target.toLowerCase();
                    if ((effectTarget === "attack rolls" && isAttackRoll) ||
                        (effectTarget === "melee attack rolls" && isMeleeAttack && isAttackRoll) ||
                        (effectTarget === "ranged attack rolls" && isRangedAttack && isAttackRoll)) {
                        hasAdvantage = true;
                    }
                }
                if (effect.category === "disadvantage") {
                    const effectTarget = effect.target.toLowerCase();
                    if ((effectTarget === "attack rolls" && isAttackRoll) ||
                        (effectTarget === "melee attack rolls" && isMeleeAttack && isAttackRoll) ||
                        (effectTarget === "ranged attack rolls" && isRangedAttack && isAttackRoll)) {
                        hasDisadvantage = true;
                    }
                }
            }
        }
    }
    
    // Check inventory items for advantage/disadvantage effects
    if (characterData.inventory) {
        for (let item of characterData.inventory) {
            if (item.effect) {
                for (let effect of item.effect) {
                    // Check for direct matches
                    if (effect.category === "advantage" && 
                        effect.target.toLowerCase() === normalizedRollName) {
                        hasAdvantage = true;
                    }
                    if (effect.category === "disadvantage" && 
                        effect.target.toLowerCase() === normalizedRollName) {
                        hasDisadvantage = true;
                    }
                    
                    // Check for category matches (Attack Rolls, etc)
                    if (effect.category === "advantage") {
                        const effectTarget = effect.target.toLowerCase();
                        if ((effectTarget === "attack rolls" && isAttackRoll) ||
                            (effectTarget === "melee attack rolls" && isMeleeAttack && isAttackRoll) ||
                            (effectTarget === "ranged attack rolls" && isRangedAttack && isAttackRoll)) {
                            hasAdvantage = true;
                        }
                    }
                    if (effect.category === "disadvantage") {
                        const effectTarget = effect.target.toLowerCase();
                        if ((effectTarget === "attack rolls" && isAttackRoll) ||
                            (effectTarget === "melee attack rolls" && isMeleeAttack && isAttackRoll) ||
                            (effectTarget === "ranged attack rolls" && isRangedAttack && isAttackRoll)) {
                            hasDisadvantage = true;
                        }
                    }
                }
            }
        }
    }
    
    // Check active conditions that might grant advantage/disadvantage
    if (characterData.conditions && characterData.conditions.active) {
        // Poisoned condition gives disadvantage on attack rolls and ability checks
        if (characterData.conditions.active.includes("Poisoned")) {
            if (isAttackRoll || isAbilityCheck) {
                hasDisadvantage = true;
            }
        }
        
        // Frightened condition gives disadvantage on ability checks and attack rolls
        if (characterData.conditions.active.includes("Frightened")) {
            if (isAttackRoll || isAbilityCheck) {
                hasDisadvantage = true;
            }
        }
        
        // Blinded condition
        if (characterData.conditions.active.includes("Blinded")) {
            if (isAttackRoll) {
                hasDisadvantage = true;
            }
        }
        
        // Invisible condition
        if (characterData.conditions.active.includes("Invisible")) {
            if (isAttackRoll) {
                hasAdvantage = true;
            }
        }
        
        // Prone condition
        if (characterData.conditions.active.includes("Prone")) {
            if (isAttackRoll) {
                // Disadvantage on ranged attacks when prone
                if (isRangedAttack) {
                    hasDisadvantage = true;
                }
                // Melee attacks are more complex - handled elsewhere
            }
        }
        
        // Restrained condition
        if (characterData.conditions.active.includes("Restrained")) {
            if (isAttackRoll) {
                hasDisadvantage = true;
            }
            if (normalizedRollName === "dexterity save") {
                hasDisadvantage = true;
            }
        }
    }
    
    // If both advantage and disadvantage are present, they cancel out
    if (hasAdvantage && hasDisadvantage) {
        return "normal";
    } else if (hasAdvantage) {
        return "advantage";
    } else if (hasDisadvantage) {
        return "disadvantage";
    } else {
        return "normal";
    }
}

/**
 * Checks if the character has resistance, immunity, or vulnerability to a damage type.
 * @param {string} damageType - The damage type to check.
 * @param {Object} characterData - The full JSON character data.
 * @returns {string} - "resistance", "immunity", "vulnerability", or "normal"
 */
export function getDamageModifier(damageType, characterData) {
    if (!characterData.conditions) return "normal";
    
    const normalizedDamageType = damageType.toLowerCase();
    
    // Check character's base resistances/immunities/vulnerabilities
    if (characterData.conditions.resistances && 
        characterData.conditions.resistances.some(r => r.toLowerCase() === normalizedDamageType)) {
        return "resistance";
    }
    
    if (characterData.conditions.immunities && 
        characterData.conditions.immunities.some(i => i.toLowerCase() === normalizedDamageType)) {
        return "immunity";
    }
    
    if (characterData.conditions.vulnerabilities && 
        characterData.conditions.vulnerabilities.some(v => v.toLowerCase() === normalizedDamageType)) {
        return "vulnerability";
    }
    
    // Check bonuses for resistances/immunities/vulnerabilities
    if (characterData.bonuses) {
        for (let bonus of characterData.bonuses) {
            if (!bonus.effects) continue;
            
            for (let effect of bonus.effects) {
                if (effect.category === "resistance" && 
                    effect.target.toLowerCase() === normalizedDamageType) {
                    return "resistance";
                }
                if (effect.category === "immunity" && 
                    effect.target.toLowerCase() === normalizedDamageType) {
                    return "immunity";
                }
                if (effect.category === "vulnerability" && 
                    effect.target.toLowerCase() === normalizedDamageType) {
                    return "vulnerability";
                }
            }
        }
    }
    
    // Check inventory items for resistances/immunities/vulnerabilities
    if (characterData.inventory) {
        for (let item of characterData.inventory) {
            if (item.effect) {
                for (let effect of item.effect) {
                    if (effect.category === "resistance" && 
                        effect.target.toLowerCase() === normalizedDamageType) {
                        return "resistance";
                    }
                    if (effect.category === "immunity" && 
                        effect.target.toLowerCase() === normalizedDamageType) {
                        return "immunity";
                    }
                    if (effect.category === "vulnerability" && 
                        effect.target.toLowerCase() === normalizedDamageType) {
                        return "vulnerability";
                    }
                }
            }
        }
    }
    
    return "normal";
}
/**
 * Checks if the character has a specific condition.
 * @param {string} conditionName - The condition to check.
 * @param {Object} characterData - The full JSON character data.
 * @returns {boolean} - True if the character has the condition, false otherwise.
 */
export function hasCondition(conditionName, characterData) {
    // Check if the condition is directly in the active conditions list
    if (characterData.conditions && 
        characterData.conditions.active && 
        characterData.conditions.active.includes(conditionName)) {
        return true;
    }
    
    // Check bonuses for condition effects
    if (characterData.bonuses) {
        for (let bonus of characterData.bonuses) {
            if (!bonus.effects) continue;
            
            for (let effect of bonus.effects) {
                if (effect.category === "condition" && 
                    effect.target === conditionName) {
                    return true;
                }
            }
        }
    }
    
    // Check inventory items for condition effects
    if (characterData.inventory) {
        for (let item of characterData.inventory) {
            if (item.effect) {
                for (let effect of item.effect) {
                    if (effect.category === "condition" && 
                        effect.target === conditionName) {
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}
