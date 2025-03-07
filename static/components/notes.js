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
            .notes-actions {
                display: flex;
                justify-content: flex-end;
            }
            .save-notes-btn {
                background-color: #4a6fa5;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
            }
            .save-notes-btn:hover {
                background-color: #3a5f95;
            }
        </style>
        <div class="notes-container">
            <textarea id="character-notes" class="notes-textarea" placeholder="Enter your notes here...">${characterData.notes || ''}</textarea>
            <div class="notes-actions">
                <button id="save-notes-btn" class="save-notes-btn">Save Notes</button>
            </div>
        </div>
    `;

    // Add event listener for saving notes
    setTimeout(() => {
        document.getElementById("save-notes-btn").addEventListener("click", saveNotes);
    }, 100);

    function saveNotes() {
        const notes = document.getElementById("character-notes").value;
        
        fetch("/save_notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes }),
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Notes saved successfully!");
            } else {
                alert("Failed to save notes.");
            }
        });
    }
}
