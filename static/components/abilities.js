import { calculateModifier, getProficiencyBonus } from "../helpers.js";

export function populateAbilitiesSection(containerElement, characterData) {
    const abilityScores = characterData.ability_scores;
    const savingThrows = characterData.saving_throws;
    const proficiencyBonus = getProficiencyBonus(characterData.player_info.level);

    let html = `<h3>Abilities</h3>`;

    Object.keys(abilityScores).forEach(stat => {
        html += `
            <div class="ability-row">
                <label>${stat.toUpperCase()}</label>
                <span>${abilityScores[stat]}</span>
                <span class="modifier">${calculateModifier(abilityScores[stat])}</span>
            </div>
        `;
    });

    html += `<h3>Saving Throws</h3>`;

    Object.keys(savingThrows).forEach(stat => {
        let baseMod = calculateModifier(abilityScores[stat]);
        let totalMod = savingThrows[stat] ? parseInt(baseMod) + proficiencyBonus : baseMod;

        // Ensure "+" is added for positive values
        totalMod = totalMod >= 0 ? `+${totalMod}` : totalMod;

        html += `
            <div class="save-row">
                <input type="checkbox" ${savingThrows[stat] ? "checked" : ""} disabled>
                <label>${stat.toUpperCase()}</label>
                <span class="modifier">${totalMod}</span>
            </div>
        `;
    });

    containerElement.innerHTML = html;
}
