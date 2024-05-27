const noteWindow = document.getElementById('noteWindow');
const noteList = document.getElementById('noteList');
const noteTitle = document.getElementById('noteTitle');
const noteTitleInput = document.getElementById('noteTitleInput');
const noteContent = document.getElementById('noteContent');
const btnAdd = document.getElementById('btnAdd');
const divButtons = document.getElementById('divButtons');

let isDragging = false;
let offsetX, offsetY;
let currentNoteIndex = null; // Track the index of the currently displayed note
let isMaximized = false; // Track whether the window is maximized
let previousSize = {}; // Store previous window size and position

// Window control functions
function closeWindow() {
    noteWindow.style.display = 'none';
}

function minimizeWindow() {
    noteWindow.style.height = '40px';
}

function maximizeWindow() {
    if (!isMaximized) {
        // If not currently maximized, store previous size and position
        previousSize = {
            width: noteWindow.style.width,
            height: noteWindow.style.height,
            top: noteWindow.style.top,
            left: noteWindow.style.left
        };

        // Maximize the window
        noteWindow.style.width = '100%';
        noteWindow.style.height = '100%';
        noteWindow.style.top = '0';
        noteWindow.style.left = '0';
        document.querySelector('.maximize').innerHTML = '&#11036;'; // Change button icon
    } else {
        // If currently maximized, restore previous size and position
        noteWindow.style.width = previousSize.width;
        noteWindow.style.height = previousSize.height;
        noteWindow.style.top = previousSize.top;
        noteWindow.style.left = previousSize.left;
        document.querySelector('.maximize').innerHTML = '▢'; // Change button icon
    }
    isMaximized = !isMaximized; // Toggle maximize state
}

// Dragging functionality
function startDragging(event) {
    isDragging = true;
    offsetX = event.clientX - noteWindow.offsetLeft;
    offsetY = event.clientY - noteWindow.offsetTop;
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDragging);
}

function onDrag(event) {
    if (isDragging) {
        noteWindow.style.left = `${event.clientX - offsetX}px`;
        noteWindow.style.top = `${event.clientY - offsetY}px`;
    }
}

function stopDragging() {
    if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDragging);
    }
}

// Save and load notes
function saveNote() {
    const title = noteTitleInput.value;
    let content = noteContent.value;
    const currentTime = new Date().toLocaleTimeString();
    const updatedTimeLine = `\n\nLast updated: ${currentTime}`;

    // If there's a currently displayed note and the title is not empty
    if (currentNoteIndex !== null && title) {
        const notes = getNotes();
        const note = notes[currentNoteIndex];

        // Update note title and content
        note.title = title;
        note.content = content + updatedTimeLine;

        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    } else if (title) { // If no note is currently displayed and the title is not empty, add a new note
        const note = { title, content: content + updatedTimeLine };
        const notes = getNotes();
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }
}

function getNotes() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function displayNotes() {
    noteList.innerHTML = '';
    const notes = getNotes();
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note.title;
        li.onclick = () => displayNoteContent(index);
        noteList.appendChild(li);
        addDeleteButton(li, index);
    });
}

function displayNoteContent(index) {
    showInputs();
    const notes = getNotes();
    const note = notes[index];
    noteTitleInput.value = note.title;
    noteContent.value = note.content;
    currentNoteIndex = index; // Update the current note index
}

function cancelNote(){
    noteTitleInput.style.display = 'none';
    noteContent.style.display = 'none';
    divButtons.style.display = 'none';
    btnAdd.style.display = 'block';
    currentNoteIndex = null; // Reset the current note index
    noteTitleInput.value = '';
    noteContent.value = '';
}

function showInputs(){
    noteTitleInput.style.display = 'flex';
    noteContent.style.display = 'block';
    btnAdd.style.display = 'none';
    divButtons.style.display = 'flex';
}

function addNote(){
    noteTitleInput.value = '';
    noteContent.value = '';
    showInputs();
    currentNoteIndex = null; // Reset the current note index when adding a new note
}

function addDeleteButton(element, index) {
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&#10006;';
    deleteButton.onclick = function (event) {
        event.stopPropagation();
        deleteNote(index);
    };
    element.appendChild(deleteButton);
}

function deleteNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    cancelNote();
    displayNotes();
}

// Initial display of notes
displayNotes();
cancelNote();
