const $BtnL = document.querySelector('.Zaloguj');
const $BtnR = document.querySelector('.Rejestracja');
const $BackIcn = document.querySelector('.fas');
const $BtnRgst = document.querySelector('.Zarejestruj');
const $rgstrForm = document.querySelector('.RgstrForm');
const $naglowek = document.querySelector('.HeaderR');
const $logininpt = document.querySelector('.Login');
const $passwordinpt = document.querySelector('.Haslo');
const $logInfo = document.querySelector('.loginfo')
const $nazwainfo = document.querySelector('.nazwa')
const $mailinfo = document.querySelector('.mail')
let $loginEl = [
    document.querySelector('.Content'),
    document.querySelector('.Buttons'),
    document.querySelector('.HeaderL'),
    document.querySelector('.zaloguj')];
let info;
let user;
let userTologIn;
let imie_i_nazwisko;

window.fbAsyncInit = function () {
    FB.init({
        appId: '3842840542492779',
        autoLogAppEvents: false,
        xfbml: true,
        version: 'v12.0'
    });
    window.FB.AppEvents.logPageView();
};

(function (d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/pl_POL/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


window.viaFacebook = () => {


    FB.getLoginStatus(function (response) {
        console.log('statusChangeCallback');
        console.log(response.authResponse)

        if (response.status === 'connected') {
            FB.api(`/me?access_token=${response.authResponse.accessToken}`, (data) => {
                if (data) {
                    console.log(imie_i_nazwisko)
                    imie_i_nazwisko = data.name

                    fetch('/Fbl', {
                        method: 'POST',
                        body: JSON.stringify({
                            FBresponse: response.authResponse,
                            FBresponseStatus: response.status,
                            FBuserName: imie_i_nazwisko

                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.url) {
                                location.replace(res.url)
                            } else if (res.err) {
                                $logInfo.textContent = res.err
                            }
                        })
                        .catch(err => console.log(err))
                }
            });
        }
    })
};


const ShowRegister = () => {

    $loginEl.forEach(el => el.style = 'display: none');

    $rgstrForm.style = 'display: block';
    $naglowek.style = 'display: block';

}
const ShowLogin = () => {

    $rgstrForm.style = 'display: none';
    $naglowek.style = 'display: none';

    $loginEl.forEach(el => el.style = 'display: block');
}

$BtnR.addEventListener('click', ShowRegister);
$BackIcn.addEventListener('click', ShowLogin);

// REJESTRACJA
const sendR = () => {
    fetch('/r', {
        method: 'POST',
        body: JSON.stringify({
            nazwa: user.nazwa,
            imie: user.imie,
            nazwisko: user.nazwisko,
            email: user.email,
            haslo: user.haslo,
            hasloconf: user.hasloconf,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(res => {
            if (res.nazwainfo) {
                $nazwainfo.textContent = res.nazwainfo;
            } else if (res.mailinfo) {
                $mailinfo.textContent = res.mailinfo;
            } else {
                location.replace(res.url)
            }
        })
        .catch(err => console.log(err))
}

function User(nazwa, imie, nazwisko, email, haslo, hasloconf) {
    return {
        nazwa,
        imie,
        nazwisko,
        email,
        haslo,
        hasloconf,
    }
}

const checkAndCreate = () => {
    user = undefined;
    const inpts = document.querySelectorAll('.rinput')
    const infos = document.querySelectorAll('.info')
    infos.forEach(el => el.textContent = '');

    inpts.forEach((el, i) => {
        if (el.value === '') {
            infos[i].textContent = 'Pole jest wymagane.'
        } else if (inpts[4].value !== inpts[5].value) {
            info = document.querySelector('.pass');
            info.textContent = 'Hasła muszą być zgodne.'
        } else {
            user = new User(
                inpts[0].value,
                inpts[1].value,
                inpts[2].value,
                inpts[3].value.toLowerCase(),
                inpts[4].value,
                inpts[5].value);
            info = document.getElementsByClassName(el.id)
            info.textContent = '';
        }
    })
    if (user) {
        let size = 0;
        Object.values(user).forEach(el => (el !== '') ? size++ : console.log('err'))
        if (size === 6) {
            inpts.forEach(el => el.value = '');
            JSON.stringify(user);
            sendR(user);
        }
    }
}

$BtnRgst.addEventListener('click', checkAndCreate);

const sendL = () => {
    fetch('/l', {
        method: 'POST',
        body: JSON.stringify({
            login: userTologIn.login,
            haslo: userTologIn.haslo
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(res => {
            if (res.textUserName) {
                $logInfo.textContent = res.textUserName;
            } else if (res.textPassword) {
                $logInfo.textContent = res.textPassword;
            } else {
                location.replace(res.url)
            }
        })
        .catch(err => console.log(err))
}

function LoginData(login, haslo) {
    return {
        login,
        haslo
    }
}


const checkToLogIn = () => {
    $logInfo.textContent = '';
    if ($logininpt.value === '' || $passwordinpt.value === '') {
        $logInfo.textContent = 'Wpisz nazwę użytkownika i hasło.';
    } else {
        userTologIn = new LoginData($logininpt.value, $passwordinpt.value)
        JSON.stringify(userTologIn)
        sendL(userTologIn);
        $logininpt.value = '';
        $passwordinpt.value = '';
    }
}
$BtnL.addEventListener('click', checkToLogIn);


