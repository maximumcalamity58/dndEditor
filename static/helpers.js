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

    // Determine base value directly from characterData
    let baseValue = getProperty(characterData, statName) ||
                    getProperty(characterData.combat_stats, statName) ||
                    getProperty(characterData.ability_scores, statName);

    // Apply bonuses that affect this stat
    characterData.bonuses.forEach(bonus => {
        bonus.effects.forEach(effect => {
            let effectTarget = effect.target.toLowerCase();

            if (effect.category === "stat" && effectTarget === statName) {
                if (effect.modifier === "none") {
                    baseValue += effect.amount;
                } else if (effect.modifier === "per") {
                    let perStat = getFinalStat(effect.perTarget, characterData);
                    baseValue += Math.floor(perStat / effect.perAmount) * effect.amount;
                }
            }
        });
    });

    return baseValue;
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
    // Check saving throws
    if (characterData.saving_throws[proficiencyName.toLowerCase()] === true) {
        return true;
    }

    // Check skill proficiencies
    for (let skill of characterData.skills) {
        if (skill.name.toLowerCase() === proficiencyName.toLowerCase() && skill.proficient) {
            return true;
        }
    }

    // Check bonuses that grant proficiency
    for (let bonus of characterData.bonuses) {
        for (let effect of bonus.effects) {
            if (effect.category === "proficiency" && effect.target.toLowerCase() === proficiencyName.toLowerCase()) {
                return true;
            }
        }
    }

    return false;
}
