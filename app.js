// app.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for notes (in production, you'd use a database)
let notes = [
    {
        id: 1,
        title: "Welcome Note",
        content: "This is your first note! and image created using codebuild and container running through ecs. You can create, edit, and delete notes using this app. Now with the codepipeline ....... ..... final change _ prashant ",
        timestamp: new Date().toISOString(),
        created: new Date().toLocaleString()
    }
];
let nextId = 2;

// Routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple Notes App</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #74b9ff, #0984e3);
                    min-height: 100vh;
                    padding: 20px;
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }

                .header {
                    background: linear-gradient(45deg, #6c5ce7, #a29bfe);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }

                .header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .header p {
                    opacity: 0.9;
                    font-size: 1.1rem;
                }

                .content {
                    padding: 30px;
                }

                .note-form {
                    background: #f8f9ff;
                    padding: 25px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                    border: 2px solid #e9ecef;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #2d3436;
                }

                input[type="text"], textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.3s;
                }

                input[type="text"]:focus, textarea:focus {
                    outline: none;
                    border-color: #6c5ce7;
                }

                textarea {
                    resize: vertical;
                    height: 120px;
                }

                .btn {
                    background: linear-gradient(45deg, #00b894, #00cec9);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .btn-danger {
                    background: linear-gradient(45deg, #e17055, #d63031);
                    font-size: 12px;
                    padding: 8px 15px;
                }

                .btn-edit {
                    background: linear-gradient(45deg, #fdcb6e, #e17055);
                    font-size: 12px;
                    padding: 8px 15px;
                    margin-right: 10px;
                }

                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .note-card {
                    background: white;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    transition: all 0.3s;
                    position: relative;
                }

                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    border-color: #6c5ce7;
                }

                .note-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #2d3436;
                    margin-bottom: 10px;
                }

                .note-content {
                    color: #636e72;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }

                .note-timestamp {
                    font-size: 0.85rem;
                    color: #b2bec3;
                    margin-bottom: 15px;
                }

                .note-actions {
                    display: flex;
                    gap: 10px;
                }

                .no-notes {
                    text-align: center;
                    color: #636e72;
                    font-style: italic;
                    margin-top: 40px;
                }

                @media (max-width: 768px) {
                    body { padding: 10px; }
                    .header h1 { font-size: 2rem; }
                    .content { padding: 20px; }
                    .note-form { padding: 20px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1> Simple Notes</h1>
                    <p>Create, organize, and manage your notes effortlessly</p>
                </div>
                
                <div class="content">
                    <form class="note-form" action="/notes" method="POST">
                        <h3 style="margin-bottom: 20px; color: #2d3436;"> Create New Note</h3>
                        <div class="form-group">
                            <label for="title">Note Title</label>
                            <input type="text" id="title" name="title" required placeholder="Enter note title...">
                        </div>
                        <div class="form-group">
                            <label for="content">Note Content</label>
                            <textarea id="content" name="content" required placeholder="Write your note here..."></textarea>
                        </div>
                        <button type="submit" class="btn"> Save Note</button>
                    </form>

                    <div class="notes-section">
                        <h3 style="margin-bottom: 25px; color: #2d3436; font-size: 1.5rem;"> Your Notes</h3>
                        ${notes.length > 0 ? `
                            <div class="notes-grid">
                                ${notes.map(note => `
                                    <div class="note-card">
                                        <div class="note-title">${note.title}</div>
                                        <div class="note-content">${note.content}</div>
                                        <div class="note-timestamp">Created: ${note.created}</div>
                                        <div class="note-actions">
                                            <button onclick="editNote(${note.id}, '${note.title.replace(/'/g, "\\'")}', '${note.content.replace(/'/g, "\\'")}', this)" class="btn btn-edit"> Edit</button>
                                            <form style="display: inline;" action="/notes/${note.id}" method="POST" onsubmit="return confirm('Are you sure you want to delete this note?')">
                                                <input type="hidden" name="_method" value="DELETE">
                                                <button type="submit" class="btn btn-danger">️ Delete</button>
                                            </form>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="no-notes">
                                <h3>No notes yet! </h3>
                                <p>Create your first note using the form above.</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>

            <script>
                function editNote(id, title, content, button) {
                    const card = button.closest('.note-card');
                    const titleElement = card.querySelector('.note-title');
                    const contentElement = card.querySelector('.note-content');
                    const actionsElement = card.querySelector('.note-actions');

                    // Replace content with form
                    titleElement.innerHTML = \`<input type="text" value="\${title}" id="edit-title-\${id}" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 5px;">\`;
                    contentElement.innerHTML = \`<textarea id="edit-content-\${id}" style="width: 100%; height: 80px; padding: 8px; border: 2px solid #ddd; border-radius: 5px; resize: vertical;">\${content}</textarea>\`;
                    
                    actionsElement.innerHTML = \`
                        <button onclick="saveNote(\${id})" class="btn" style="background: linear-gradient(45deg, #00b894, #00cec9);"> Save</button>
                        <button onclick="cancelEdit(\${id}, '\${title.replace(/'/g, "\\'")}', '\${content.replace(/'/g, "\\'")}', this)" class="btn btn-danger">❌ Cancel</button>
                    \`;
                }

                function cancelEdit(id, originalTitle, originalContent, button) {
                    location.reload(); // Simple way to cancel - reload the page
                }

                function saveNote(id) {
                    const newTitle = document.getElementById(\`edit-title-\${id}\`).value;
                    const newContent = document.getElementById(\`edit-content-\${id}\`).value;
                    
                    // Create a form and submit
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = \`/notes/\${id}\`;
                    
                    const methodInput = document.createElement('input');
                    methodInput.type = 'hidden';
                    methodInput.name = '_method';
                    methodInput.value = 'PUT';
                    
                    const titleInput = document.createElement('input');
                    titleInput.type = 'hidden';
                    titleInput.name = 'title';
                    titleInput.value = newTitle;
                    
                    const contentInput = document.createElement('input');
                    contentInput.type = 'hidden';
                    contentInput.name = 'content';
                    contentInput.value = newContent;
                    
                    form.appendChild(methodInput);
                    form.appendChild(titleInput);
                    form.appendChild(contentInput);
                    
                    document.body.appendChild(form);
                    form.submit();
                }
            </script>
        </body>
        </html>
    `);
});

// Create a new note
app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    
    const newNote = {
        id: nextId++,
        title: title.trim(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
        created: new Date().toLocaleString()
    };
    
    notes.push(newNote);
    res.redirect('/');
});

// Update a note
app.post('/notes/:id', (req, res) => {
    const { _method, title, content } = req.body;
    const noteId = parseInt(req.params.id);
    
    if (_method === 'PUT') {
        const noteIndex = notes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = title.trim();
            notes[noteIndex].content = content.trim();
            notes[noteIndex].timestamp = new Date().toISOString();
            notes[noteIndex].created = `${notes[noteIndex].created} (Updated: ${new Date().toLocaleString()})`;
        }
    } else if (_method === 'DELETE') {
        notes = notes.filter(note => note.id !== noteId);
    }
    
    res.redirect('/');
});

// API endpoint to get notes as JSON
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(` Notes App running on http://localhost:${PORT}`);
    console.log(` Create, edit, and delete your notes!`);
});

module.exports = app;
