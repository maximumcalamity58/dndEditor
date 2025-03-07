import { generateDeathSaves, getFinalStat, getFinalProficiencyBonus } from "../helpers.js";

export function populateCombatStats(containerElement, characterData) {
    if (!containerElement) return;

    // Fetch final computed stats with all bonuses applied
    const hitPointsCurrent = getFinalStat("hit_points_current", characterData);
    const hitPointsMax = getFinalStat("hit_points_max", characterData);
    const hitPointsTemp = getFinalStat("hit_points_temp", characterData);
    const armorClass = getFinalStat("armor_class", characterData);
    const speed = getFinalStat("speed", characterData);
    const initiative = getFinalStat("initiative", characterData);
    const proficiencyBonus = getFinalProficiencyBonus(characterData);
    const deathSavesSuccesses = getFinalStat("death_saves_successes", characterData);
    const deathSavesFailures = getFinalStat("death_saves_failures", characterData);
    const spellcastingAbility = characterData.combat_stats.spellcasting_ability;
    const spellSaveDC = getFinalStat("spellcasting_save_dc", characterData);
    const spellAttackBonus = getFinalStat("spellcasting_attack", characterData);

    containerElement.innerHTML = `
        <div class="info-box">
            <h3>Combat</h3>
            <div class="stats-container">
                <div class="stat-item">
                    <strong>Hit Points</strong>
                    <div>${hitPointsCurrent} / ${hitPointsMax}</div>
                    <small>+ ${hitPointsTemp} Temp HP</small>
                </div>
                <div class="stat-item">
                    <strong>Armor Class</strong>
                    <div>${armorClass}</div>
                </div>
                <div class="stat-item">
                    <strong>Speed</strong>
                    <div>${speed} ft</div>
                </div>
                <div class="stat-item">
                    <strong>Initiative</strong>
                    <div>${initiative}</div>
                </div>
                <div class="stat-item proficiency-box">
                    <strong>Proficiency Bonus</strong>
                    <div class="proficiency-value">+${proficiencyBonus}</div>
                </div>
            </div>
        </div>

        <div class="info-box">
            <h3>Death Saves</h3>
            <div class="death-saves-container">
                <div class="death-save-box">
                    <strong>Successes</strong>
                    <div class="death-save-checkboxes">
                        ${generateDeathSaves(deathSavesSuccesses)}
                    </div>
                </div>
                <div class="death-save-box">
                    <strong>Failures</strong>
                    <div class="death-save-checkboxes">
                        ${generateDeathSaves(deathSavesFailures)}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="info-box">
            <h3>Spellcasting</h3>
            <div class="stats-container">
                <div class="stat-item"><strong>Ability</strong> <div>${spellcastingAbility}</div></div>
                <div class="stat-item"><strong>Save DC</strong> <div>${spellSaveDC}</div></div>
                <div class="stat-item"><strong>Attack Bonus</strong> <div>${spellAttackBonus}</div></div>
            </div>
        </div>
    `;
}
