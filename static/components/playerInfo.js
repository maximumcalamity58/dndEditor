import { getProficiencyBonus } from "../helpers.js";

export function populatePlayerInfo(containerElement, characterData) {
    const details = characterData.player_info;
    const proficiencyBonus = getProficiencyBonus(details.level);

    containerElement.innerHTML = `
        <h2 class="player-name">${details.name}</h2>
        <div class="player-info-section">
            <span>${details.race}</span> | <span>${details.class}</span> | <span>${details.background}</span>
        </div>

        <div class="info-box experience-box">
            <h3>Experience</h3>
            <hr>
            <div class="experience-details">
                <span>Level ${details.level} | ${details.experience} XP</span>
            </div>
        </div>
    `;
}
