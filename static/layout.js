// Import component functions
import { populatePlayerInfo } from "./components/playerInfo.js";
import { populateCombatStats } from "./components/combatStats.js";
import { populateAbilitiesSection } from "./components/abilities.js";
import { populateSkillsSection } from "./components/skills.js";
import { populateBonusesSection } from "./components/bonuses.js";
import { populateInventorySection } from "./components/inventory.js";
import { populateConditionsSection } from "./components/conditions.js";

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
    
    // Setup tab controls (close buttons and add tab button)
    function setupTabControls() {
        // Add custom close buttons to tabs
        document.querySelectorAll('.lm_tab').forEach(tab => {
            // Only add if not already present
            if (!tab.querySelector('.lm_close_tab')) {
                // First find the title element
                const titleElement = tab.querySelector('.lm_title');
                if (titleElement) {
                    const closeBtn = document.createElement('span');
                    closeBtn.className = 'lm_close_tab';
                    closeBtn.innerHTML = '×';
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        
                        // Get the tab's content component
                        const tabTitle = titleElement.textContent;
                        const contentItem = layout.root.getItemsByFilter(item => {
                            return item.config.title === tabTitle;
                        })[0];
                    
                    if (contentItem) {
                        // Store the closed tab info
                        closedTabs[tabTitle] = {
                            componentName: contentItem.config.componentName,
                            title: contentItem.config.title
                        };
                        
                        // Close the tab
                        contentItem.remove();
                        
                        // Update the add tab button visibility
                        updateAddTabButton();
                    }
                });
                    // Insert after the title element
                    titleElement.insertAdjacentElement('afterend', closeBtn);
                }
            }
        });
        
        // Add the + button for reopening tabs if not already present
        updateAddTabButton();
    }
    
    // Update the add tab button based on closed tabs
    function updateAddTabButton() {
        // Remove existing add tab button
        const existingBtn = document.querySelector('.lm_add_tab_btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Always show the add tab button, even if there are no closed tabs
        document.querySelectorAll('.lm_header').forEach(header => {
            if (!header.querySelector('.lm_add_tab_btn')) {
                    const addBtn = document.createElement('div');
                    addBtn.className = 'lm_add_tab_btn';
                    addBtn.innerHTML = '+';
                    addBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        
                        // Toggle dropdown
                        let dropdown = document.querySelector('.lm_tab_dropdown');
                        
                        // Remove existing dropdown if it exists
                        if (dropdown) {
                            dropdown.remove();
                        }
                        
                        // Create new dropdown
                        dropdown = document.createElement('div');
                        dropdown.className = 'lm_tab_dropdown active';
                        
                        // Add closed tabs to dropdown if there are any
                        if (Object.keys(closedTabs).length > 0) {
                            Object.entries(closedTabs).forEach(([title, config]) => {
                                const item = document.createElement('div');
                                item.className = 'lm_tab_dropdown_item';
                                item.textContent = title;
                                item.addEventListener('click', () => {
                                    // Find the stack to add to
                                    const stack = header.closest('.lm_item').layoutManager._dragSources[0]._element.layoutManager;
                                    
                                    // Add the tab back
                                    stack.addComponent(config.componentName, config.title);
                                    
                                    // Remove from closed tabs
                                    delete closedTabs[title];
                                    
                                    // Close dropdown
                                    dropdown.remove();
                                    
                                    // Update add tab button
                                    updateAddTabButton();
                                });
                                dropdown.appendChild(item);
                            });
                        } else {
                            // If no closed tabs, show a message
                            const message = document.createElement('div');
                            message.className = 'lm_tab_dropdown_item';
                            message.textContent = 'No closed tabs';
                            message.style.fontStyle = 'italic';
                            message.style.color = '#888';
                            dropdown.appendChild(message);
                        }
                        
                        // Add dropdown to DOM - position it relative to the add button
                        dropdown.style.top = '35px';
                        dropdown.style.right = '5px';
                        header.appendChild(dropdown);
                        
                        // Close dropdown when clicking outside
                        document.addEventListener('click', function closeDropdown(e) {
                            if (!dropdown.contains(e.target) && e.target !== addBtn) {
                                dropdown.remove();
                                document.removeEventListener('click', closeDropdown);
                            }
                        });
                    });
                    
                    header.appendChild(addBtn);
                }
            });
        }
    }

    // 🔹 Ensure GoldenLayout updates dynamically on window resize
    function adjustLayoutSize() {
        layout.updateSize(); // Forces layout to resize properly
        removeForcedWidth(); // Apply width fix again
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
