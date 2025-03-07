// Import component functions
import { populatePlayerInfo } from "./components/playerInfo.js";
import { populateCombatStats } from "./components/combatStats.js";
import { populateAbilitiesSection } from "./components/abilities.js";
import { populateSkillsSection } from "./components/skills.js";

document.addEventListener("DOMContentLoaded", async () => {
    const layoutContainer = document.getElementById("layout-container");

    // Load JSON data
    let characterData = await fetch("/static/data.json").then(response => response.json());

    const config = {
        settings: {
            showPopoutIcon: false,
            reorderEnabled: true,
            selectionEnabled: true
        },
        dimensions: {
            headerHeight: 30,
        },
        content: [{
            type: 'row',
            content: [
                {
                    type: 'column',
                    width: 33, // Ensures equal width across three sections
                    content: [
                        {
                            type: 'stack',
                            content: [
                                { type: 'component', componentName: 'player-info', title: 'Player Info' },
                                { type: 'component', componentName: 'combat-stats', title: 'Combat Stats' },
                            ]
                        },
                        {
                            type: 'stack',
                            content: [
                                { type: 'component', componentName: 'abilities', title: 'Abilities & Saving Throws' },
                                { type: 'component', componentName: 'skills', title: 'Skills' }
                            ]
                        }
                    ]
                },
                {
                    type: 'column',
                    width: 33,
                    content: [
                        { type: 'component', componentName: 'actions', title: 'Actions' }
                    ]
                },
                {
                    type: 'column',
                    width: 33,
                    content: [
                        { type: 'component', componentName: 'equipment', title: 'Equipment' },
                        {
                            type: 'stack',
                            content: [
                                { type: 'component', componentName: 'features', title: 'Features' },
                                { type: 'component', componentName: 'bonuses', title: 'Bonuses' }
                            ]
                        }
                    ]
                }
            ]
        }]
    };

    // Initialize GoldenLayout
    const layout = new GoldenLayout(config, layoutContainer);

    // Register Components BEFORE initializing layout
    const componentNames = ["player-info", "combat-stats", "abilities", "skills", "actions", "equipment", "features", "bonuses"];

    componentNames.forEach(section => {
        layout.registerComponent(section, function(container) {
            const panel = document.createElement("div");
            panel.classList.add("goldenlayout-container", "scrollable");
            panel.style.height = "100%"; // Ensure the container fills the space
            panel.innerHTML = `
                <div class="panel-header">
                    <span>${section.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div class="panel-content" style="height: calc(100% - 40px);"></div> <!-- Make content fill -->
            `;

            container.getElement().append(panel);

            // Dynamically call the appropriate function
            if (section === "player-info") {
                populatePlayerInfo(panel.querySelector(".panel-content"), characterData);
            } else if (section === "combat-stats") {
                populateCombatStats(panel.querySelector(".panel-content"), characterData);
            } else if (section === "abilities") {
                populateAbilitiesSection(panel.querySelector(".panel-content"), characterData);
            } else if (section === "skills") {
                populateSkillsSection(panel.querySelector(".panel-content"), characterData);
            }
        });
    });

    layout.init();

    // 🔹 Ensure GoldenLayout updates dynamically on window resize
    function adjustLayoutSize() {
        layout.updateSize(); // Forces layout to resize properly
    }

    function adjustLayoutHeight() {
        const windowHeight = window.innerHeight;
        const layoutHeaderHeight = document.querySelector(".lm_header")?.offsetHeight || 30;
        const totalHeight = windowHeight - layoutHeaderHeight;

        document.querySelectorAll(".goldenlayout-container").forEach(container => {
            container.style.height = `${totalHeight}px`;
        });
    }

    window.addEventListener("resize", adjustLayoutSize);
    window.addEventListener("resize", adjustLayoutHeight);
    adjustLayoutHeight();
});
