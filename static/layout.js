// Import component functions
import { populatePlayerInfo } from "./components/playerInfo.js";
import { populateCombatStats } from "./components/combatStats.js";
import { populateAbilitiesSection } from "./components/abilities.js";
import { populateSkillsSection } from "./components/skills.js";
import { populateBonusesSection } from "./components/bonuses.js";
import { populateInventorySection } from "./components/inventory.js";
import { populateConditionsSection } from "./components/conditions.js";
import { populateEquipmentSection } from "./components/equipment.js";
import { populateNotesSection } from "./components/notes.js";
import { populateActionsSection } from "./components/actions.js";

document.addEventListener("DOMContentLoaded", async () => {
    const layoutContainer = document.getElementById("layout-container");

    // Load JSON data
    let characterData = await fetch("/static/data.json").then(response => response.json());

    const config = {
        settings: {
            showPopoutIcon: false,
            reorderEnabled: true,
            selectionEnabled: true,
            showCloseIcon: true,
            showMaximiseIcon: false
        },
        dimensions: {
            headerHeight: 40,
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
                                { type: 'component', componentName: 'conditions', title: 'Conditions' },
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
                        {
                            type: 'stack',
                            content: [
                                { type: 'component', componentName: 'actions', title: 'Actions' },
                                { type: 'component', componentName: 'spells', title: 'Spells' }
                            ]
                        }
                    ]
                },
                {
                    type: 'column',
                    width: 33,
                    content: [
                        {
                            type: 'stack',
                            content: [
                                { type: 'component', componentName: 'equipment', title: 'Equipment' },
                                { type: 'component', componentName: 'inventory', title: 'Inventory' },
                                { type: 'component', componentName: 'notes', title: 'Notes' },
                            ]
                        },
                        {
                            type: 'stack',
                            content: [
                                { type: 'component', componentName: 'features', title: 'Features' },
                                { type: 'component', componentName: 'traits', title: 'Traits' },
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

    // Register Components
    const componentNames = ["player-info", "combat-stats", "conditions", "abilities", "skills", "actions", "spells", "equipment", "inventory", "notes", "features", "traits", "bonuses"];

    componentNames.forEach(section => {
        layout.registerComponent(section, function(container) {
            const panel = document.createElement("div");
            panel.classList.add("goldenlayout-container", "scrollable");

            // Ensure proper layout sizing
            panel.style.width = "auto"; // Remove inline `width: 100%`
            panel.style.maxWidth = "100%";
            panel.style.height = "100%";

            panel.innerHTML = `
                <div class="panel-header">
                    <span>${section.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div class="panel-content"></div>
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
            } else if (section === "bonuses") {
                populateBonusesSection(panel.querySelector(".panel-content"), characterData);
            } else if (section === "inventory") {
                populateInventorySection(panel.querySelector(".panel-content"), characterData);
            } else if (section === "conditions") {
                populateConditionsSection(panel.querySelector(".panel-content"), characterData);
            } else if (section === "equipment") {
                populateEquipmentSection(panel.querySelector(".panel-content"), characterData);
            } else if (section === "notes") {
                populateNotesSection(panel.querySelector(".panel-content"), characterData);
            } else if (section === "actions") {
                populateActionsSection(panel.querySelector(".panel-content"), characterData);
            }
        });
    });

    layout.init();

    window.updateCharacterStats = async function() {
        // Re-fetch the latest character data
        characterData = await fetch("/static/data.json").then(response => response.json());

        document.querySelectorAll(".goldenlayout-container").forEach(panel => {
            const section = panel.querySelector(".panel-header span").textContent.toLowerCase().replace(" ", "-");
            const contentContainer = panel.querySelector(".panel-content");
            contentContainer.innerHTML = ""; // Clear existing content

            if (section === "player-info") {
                populatePlayerInfo(contentContainer, characterData);
            } else if (section === "combat-stats") {
                populateCombatStats(contentContainer, characterData);
            } else if (section === "abilities") {
                populateAbilitiesSection(contentContainer, characterData);
            } else if (section === "skills") {
                populateSkillsSection(contentContainer, characterData);
            } else if (section === "bonuses") {
                populateBonusesSection(contentContainer, characterData);
            } else if (section === "inventory") {
                populateInventorySection(contentContainer, characterData);
            } else if (section === "conditions") {
                populateConditionsSection(contentContainer, characterData);
            } else if (section === "equipment") {
                populateEquipmentSection(contentContainer, characterData);
            } else if (section === "notes") {
                populateNotesSection(contentContainer, characterData);
            } else if (section === "actions") {
                populateActionsSection(contentContainer, characterData);
            }
        });
    };


    // 🔹 Remove Forced `width: 100%` from GoldenLayout Containers
    function removeForcedWidth() {
        document.querySelectorAll(".goldenlayout-container").forEach(container => {
            container.style.width = "auto";  // Prevent forced `width: 100%`
            container.style.maxWidth = "100%";  // Ensure it does not overflow
        });

        document.querySelectorAll(".lm_content, .lm_items, .lm_stack").forEach(item => {
            item.style.width = "auto";  // Remove forced width from stack items
            item.style.maxWidth = "100%";
        });
    }

    layout.on('initialised', () => {
        removeForcedWidth();
        setupTabControls();
    });

    layout.on('stateChanged', () => {
        removeForcedWidth();
        setupTabControls();
    });
    
    // Track closed tabs for reopening
    const closedTabs = {};
    
    // Setup tab controls
    function setupTabControls() {
        // No tab controls needed - removed add/close buttons
    }
    
    // Function removed - no add tab button needed

    // 🔹 Ensure GoldenLayout updates dynamically on window resize
    function adjustLayoutSize() {
        if (layout && typeof layout.updateSize === 'function') {
            layout.updateSize(); // Forces layout to resize properly
            removeForcedWidth(); // Apply width fix again
        }
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

    // 🔹 Ensure no overflow issues
    function fixOverflow() {
        document.querySelectorAll(".lm_content").forEach(content => {
            content.style.maxWidth = "100%";
            content.style.overflowX = "hidden";
        });

        document.querySelectorAll(".lm_item").forEach(item => {
            item.style.maxWidth = "100%";
            item.style.overflowX = "hidden";
        });
    }

    fixOverflow();
    window.addEventListener("resize", fixOverflow);
});
