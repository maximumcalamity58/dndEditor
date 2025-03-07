import { calculateModifier, getFinalProficiencyBonus, getFinalStat, hasProficiency } from "../helpers.js";

export function populateSkillsSection(containerElement, characterData) {
    if (!containerElement) return;

    const proficiencyBonus = getFinalProficiencyBonus(characterData); // Uses dynamic proficiency bonus

    let html = `<h3>Skills</h3>`;

    characterData.skills.forEach(skill => {
        const isProficient = hasProficiency(skill.name, characterData);

        // Get the final ability score with bonuses
        let abilityModifier = calculateModifier(getFinalStat(skill.related_stat, characterData), false);

        // Check if there are any direct skill bonuses
        let skillBonus = getFinalStat(skill.name, characterData); // Checks if skill has direct bonus

        // Calculate total modifier: Ability Modifier + Skill Bonus + (Proficiency Bonus if proficient)
        let totalModifier = abilityModifier + skillBonus + (isProficient ? proficiencyBonus : 0);

        // Ensure "+" is added for positive values
        totalModifier = totalModifier >= 0 ? `+${totalModifier}` : totalModifier;

        html += `
            <div class="skill-row">
                <input type="checkbox" ${isProficient ? "checked" : ""} disabled>
                <label>${skill.name} (${skill.related_stat.toUpperCase()})</label>
                <span class="modifier">${totalModifier}</span>
            </div>
        `;
    });

    containerElement.innerHTML = html;
}
