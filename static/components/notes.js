export function populateNotesSection(containerElement, characterData) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <style>
            .notes-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 10px;
            }
            .notes-textarea {
                flex-grow: 1;
                min-height: 300px;
                padding: 10px;
                background-color: #333;
                color: #e0e0e0;
                border: 1px solid #555;
                border-radius: 5px;
                font-family: inherit;
                font-size: 1em;
                resize: none;
                margin-bottom: 10px;
            }
            .autosave-indicator {
                font-size: 0.8em;
                color: #aaa;
                text-align: right;
                margin-top: 5px;
                font-style: italic;
            }
        </style>
        <div class="notes-container">
            <textarea id="character-notes" class="notes-textarea" placeholder="Enter your notes here...">${characterData.notes || ''}</textarea>
            <div class="autosave-indicator">Auto-saving...</div>
        </div>
    `;

    // Add auto-save functionality
    setTimeout(() => {
        const notesTextarea = document.getElementById("character-notes");
        if (notesTextarea) {
            let saveTimeout;
            
            // Function to save notes
            const saveNotes = () => {
                const notes = notesTextarea.value;
                
                fetch("/save_notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log("Notes saved successfully");
                    } else {
                        console.error("Failed to save notes");
                    }
                })
                .catch(error => {
                    console.error("Error saving notes:", error);
                });
            };
            
            // Save on input with debounce (5 seconds)
            notesTextarea.addEventListener("input", () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(saveNotes, 5000);
            });
            
            // Save on blur (when clicking away)
            notesTextarea.addEventListener("blur", saveNotes);
        }
    }, 100);
}
