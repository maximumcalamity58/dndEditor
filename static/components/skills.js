import { calculateModifier, getProficiencyBonus } from "../helpers.js";

export function populateSkillsSection(containerElement, characterData) {
    const skills = characterData.skills;
    const abilityScores = characterData.ability_scores;
    const proficiencyBonus = getProficiencyBonus(characterData.player_info.level);

    let html = `<h3>Skills</h3>`;

    skills.forEach(skill => {
        const isProficient = skill.proficient;
        let baseModifier = calculateModifier(abilityScores[skill.related_stat]);
        let totalModifier = isProficient ? parseInt(baseModifier) + proficiencyBonus : baseModifier;

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
