import { calculateModifier, getFinalProficiencyBonus, getFinalStat, hasProficiency } from "../helpers.js";

export function populateAbilitiesSection(containerElement, characterData) {
    if (!containerElement) return;

    const proficiencyBonus = getFinalProficiencyBonus(characterData); // Use dynamic proficiency bonus

    let html = `
        <div class="abilities-wrapper">
            <div class="ability-scores">
                <h3>Ability Scores</h3>
    `;

    Object.keys(characterData.ability_scores).forEach(stat => {
        let finalStat = getFinalStat(stat, characterData); // Get final ability score
        html += `
            <div class="ability-row">
                <label>${stat.toUpperCase()}</label>
                <span class="ability-value">${finalStat}</span>
                <span class="modifier-value">${calculateModifier(finalStat, true)}</span>
            </div>
        `;
    });

    html += `</div> <!-- End ability scores -->`;

    html += `
        <div class="saving-throws">
            <h3>Saving Throws</h3>
    `;

    Object.keys(characterData.ability_scores).forEach(stat => {
        let finalStat = getFinalStat(stat, characterData);
        let baseMod = calculateModifier(finalStat, false);
        let isProficient = hasProficiency(`${stat} Save`, characterData);
        let totalMod = isProficient ? baseMod + proficiencyBonus : baseMod;

        // Ensure "+" is added for positive values
        totalMod = totalMod >= 0 ? `+${totalMod}` : totalMod;

        html += `
            <div class="save-row">
                <input type="checkbox" ${isProficient ? "checked" : ""} disabled>
                <label>${stat.toUpperCase()}</label>
                <span class="modifier-value">${totalMod}</span>
            </div>
        `;
    });

    html += `</div> <!-- End saving throws -->`;
    html += `</div> <!-- End abilities-wrapper -->`;

    containerElement.innerHTML = html;
}
