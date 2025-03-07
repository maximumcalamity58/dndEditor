import { generateDeathSaves, getProficiencyBonus } from "../helpers.js";

export function populateCombatStats(containerElement, characterData) {
    const stats = characterData.combat_stats;
    const proficiencyBonus = getProficiencyBonus(characterData.player_info.level);

    containerElement.innerHTML = `
        <div class="info-box">
            <h3>Combat Stats</h3>
            <hr>
            <div class="stats-container">
                <div class="stat-item">
                    <strong>Hit Points</strong>
                    <div>${stats.hit_points.current} / ${stats.hit_points.max}</div>
                    <small>+ ${stats.hit_points.temp} Temp HP</small>
                </div>
                <div class="stat-item">
                    <strong>Armor Class</strong>
                    <div>${stats.armor_class}</div>
                </div>
                <div class="stat-item">
                    <strong>Speed</strong>
                    <div>${stats.speed} ft</div>
                </div>
                <div class="stat-item">
                    <strong>Initiative</strong>
                    <div>${stats.initiative}</div>
                </div>
                <div class="stat-item proficiency-box">
                    <strong>Proficiency Bonus</strong>
                    <div class="proficiency-value">${proficiencyBonus}</div>
                </div>
            </div>
        </div>

        <div class="info-box">
            <h3>Death Saves</h3>
            <hr>
            <div class="death-saves">
                <span>Successes:</span> ${generateDeathSaves(stats.death_saves.successes)}
                <span>Failures:</span> ${generateDeathSaves(stats.death_saves.failures)}
            </div>
        </div>
        
        <div class="info-box">
            <h3>Spellcasting</h3>
            <hr>
            <div class="stats-container">
                <div class="stat-item"><strong>Ability</strong> <div>${stats.spellcasting.ability}</div></div>
                <div class="stat-item"><strong>Save DC</strong> <div>${stats.spellcasting.save_dc}</div></div>
                <div class="stat-item"><strong>Attack Bonus</strong> <div>${stats.spellcasting.attack}</div></div>
            </div>
        </div>
    `;
}
