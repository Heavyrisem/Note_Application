

function showLoginLayout() {
    console.log('d')
    document.getElementById("loginForm").style.display = "flex";
}

function loginNext() {
    const info = {
        id: document.LoginForm.id.value,
        password: document.LoginForm.password.value,
        autologin: document.LoginForm.autologin.checked
    };
    

    ipcRenderer.send('login', info);
    // ipcRenderer.once('login_deny_pw', (event, Data) => {
    //     // 비밀번호 틀림 알람
    // });

    // ipcRenderer.once('login_deny_id', (event, Data) => {
    //     // 아이디 없음, 회원가입 안내
    // });

    // ipcRenderer.once('login_allow', (event, Data) => {
        
    // });
    // console.log(info)
}