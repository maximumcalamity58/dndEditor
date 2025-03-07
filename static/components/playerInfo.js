// playerInfo.js
import { getProficiencyBonus } from "../helpers.js";

export function populatePlayerInfo(containerElement, characterData) {
    const details = characterData.player_info;
    const proficiencyBonus = getProficiencyBonus(details.level);

    containerElement.innerHTML = `
        <style>
            .character-image-container {
                display: flex;
                justify-content: center;
                margin-bottom: 15px;
            }
            #character-image {
                position: relative;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid #444;
                background-color: #222;
            }
            #character-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            #change-image-btn {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                padding: 5px;
                cursor: pointer;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s;
            }
            #character-image:hover #change-image-btn {
                opacity: 1;
            }
            .backstory-section {
                margin-top: 15px;
            }
            #character-backstory {
                width: 100%;
                min-height: 100px;
                padding: 10px;
                background-color: #333;
                color: #e0e0e0;
                border: 1px solid #555;
                border-radius: 5px;
                font-family: inherit;
                font-size: 0.9em;
                resize: vertical;
                margin-bottom: 10px;
            }
            #save-backstory-btn {
                background-color: #4a6fa5;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
            }
            #save-backstory-btn:hover {
                background-color: #3a5f95;
            }
        </style>
        <div class="character-image-container">
            <div id="character-image">
                <img src="${details.image_url || '/static/default-character.png'}" alt="Character Image" id="character-img">
                <button id="change-image-btn">Change Image</button>
            </div>
        </div>
        <h2 class="player-name">${details.name}</h2>
        <div class="player-info-section">
            <span>${details.race}</span> | <span>${details.class}</span> | <span>${details.background || 'No Background'}</span>
        </div>

        <div class="info-box experience-box">
            <h3>Experience</h3>
            <div class="experience-details">
                <span>Level ${details.level} | ${details.experience} XP</span>
            </div>
        </div>
        
        <div class="backstory-section">
            <h3>Backstory</h3>
            <textarea id="character-backstory" placeholder="Enter your character's backstory here...">${details.backstory || ''}</textarea>
            <button id="save-backstory-btn">Save Backstory</button>
        </div>
        
        <script>
            // Add event listeners after the DOM is fully loaded
            setTimeout(() => {
                // Image change button
                const changeImageBtn = document.getElementById("change-image-btn");
                if (changeImageBtn) {
                    changeImageBtn.addEventListener("click", () => {
                        const imageUrl = prompt("Enter the URL for your character image:", "${details.image_url || ''}");
                        if (imageUrl !== null) {
                            // Update the image immediately
                            document.getElementById("character-img").src = imageUrl || '/static/default-character.png';
                            
                            // Save to server
                            fetch("/save_character_image", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ image_url: imageUrl }),
                            });
                        }
                    });
                }
                
                // Save backstory button
                const saveBackstoryBtn = document.getElementById("save-backstory-btn");
                if (saveBackstoryBtn) {
                    saveBackstoryBtn.addEventListener("click", () => {
                        const backstory = document.getElementById("character-backstory").value;
                        
                        fetch("/save_backstory", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ backstory }),
                        }).then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert("Backstory saved successfully!");
                            } else {
                                alert("Failed to save backstory.");
                            }
                        });
                    });
                }
            }, 100);
        </script>
    `;
}
