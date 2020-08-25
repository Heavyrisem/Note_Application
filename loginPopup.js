function hideLoginLayout() {
    document.getElementById("loginForm").style.display = "none";
}

function showLoginLayout() {
    document.getElementById("loginForm").style.display = "flex";
}

function register() {
    const info = {
        id: document.LoginForm.id.value,
        password: document.LoginForm.password.value,
        autologin: document.LoginForm.autologin.checked
    };

    ipcRenderer.send('register', info);
    ipcRenderer.once("register", id => {
        test(id);
    });
}

function test(id) {
    ipcRenderer.send('login', id);
}

function loginNext() {

    document.getElementById("id_input").style.display = 'none';
    document.getElementById("pw_input").style.display = 'none';
    const info = {
        id: document.LoginForm.id.value,
        password: document.LoginForm.password.value,
        autologin: document.LoginForm.autologin.checked
    };
    if (info.id != undefined && info.password != undefined) {
        ipcRenderer.send('login', info);
    }

};

ipcRenderer.once('login_deny_pw', (event, Data) => {
    // 비밀번호 틀림 알람
    console.log("login_deny_pw");
    document.getElementById("pw_input").style.display = 'block';
});

ipcRenderer.once('login_deny_id', (event, Data) => {
    // 아이디 없음, 회원가입 안내\
    console.log("login_deny_id");
    document.getElementById("id_input").style.display = 'block';
});

ipcRenderer.once('login_allow', (event, Data) => {
    console.log("login_allow");
    hideLoginLayout();
});