export function calculateModifier(score) {
    const mod = Math.floor((score - 10) / 2);
    return mod;
}

export function getProficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2; // Standard D&D progression
}

export function generateDeathSaves(count) {
    return `
        ${[...Array(3)].map((_, i) => `<input type="checkbox" ${i < count ? "checked" : ""} disabled>`).join("")}
    `;
}