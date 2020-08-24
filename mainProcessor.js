const { ipcRenderer } = require('electron');

// ipcRenderer.send('cookie_check', undefined);
ipcRenderer.on('cookie_check', (event, Data) => {
    if (Data == undefined) {
        console.log('open loginLayout')
        showLoginLayout();
    }
})

window.onload = get_note;
// ipcRenderer.on('need_update', (event, Data) => {
//     console.log(Data);
//     reload_note(Data);
//     // location.reload();
// });
let lastNum;

function reload_note(Data) {
    let note_root = document.getElementById('root_note');
    
    while (note_root.hasChildNodes()) {
        note_root.removeChild(note_root.firstChild);
    }
    let input_form = document.createElement('form');
    input_form.name = 'note_form';
    input_form.classList = "note note_form";
    input_form.innerHTML = `<input name="title" type="text" class="note_title_input" placeholder="Title"></input><button class="submit_btn" onclick="add_note()" type="button">추가</button><textarea name="description" class="note_description_input" onkeydown="resize(this)" onkeyup="resize(this)" placeholder="Description"></textarea>`;

    note_root.append(input_form);

    if (Data == null) return;
    Data.forEach((value, index) => {
        if (value == undefined) return;
            let note_str = `<span class="note_title">${value.title}</span><span class="note_delete" id="${value.id}" onclick="delete_note(this)">×</span><br><span class="note_description">${value.description}</span>`;
            let note = document.createElement('div');
            note.className = "note";
            note.id = "note_"+value.id;
            note.innerHTML = note_str;
            
            note_root.append(note);
    });
}

function get_note() {
    let note_root = document.getElementById('root_note');

    ipcRenderer.send('get_note', 'get');
    ipcRenderer.on('need_update', (event, Data) => {
        reload_note(Data);
    });


}

function add_note() {
    const title = document.note_form.title.value;
    const description = document.note_form.description.value;

    if (!(title == '' || description == '')) {
        ipcRenderer.send('add_note', { title: document.note_form.title.value, description: document.note_form.description.value });
    }
}

function delete_note(e) {
    ipcRenderer.send('delete_note', e.id);
    document.getElementById("note_"+e.id).remove();
}

function resize(obj) {
    obj.style.height = '1px';
    obj.style.height = (12+obj.scrollHeight)+"px";
}