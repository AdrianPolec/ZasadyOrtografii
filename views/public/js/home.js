const $logOut = document.querySelector('.logOut')
const $boards = document.querySelectorAll('.board')
const $buttons = document.querySelectorAll('.blok')

const gry = ['<iframe src="https://wordwall.net/pl/embed/db0f8d991fc9415aa8ff5c4bb9d9a079?themeId=41&templateId=38" width="500" height="380" allowfullscreen></iframe>']



const logOut = () => {
    fetch('/logout', {
        method: 'GET',
    })
     .then(res => res.json())
     .then(res => {
         location.replace(res.url)
         document.cookie = "cookiename=session ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
         document.cookie = "cookiename=session.sig ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        })
     .catch(err => console.log(err))
}

const showBoard = (e) => {
    if(e.target.closest('button').classList.contains('blok')) {
        $buttons.forEach(el => el.disabled = false)
        e.target.disabled = true;
        $boards.forEach(el => {
            el.style.display = 'none';
            if (el.id === e.target.textContent) {
                el.style.display = 'block';
                if(el.id === 'Graj')
                    el.innerHTML = gry[0]
            }  
        })
    }
}
$logOut.addEventListener('click', logOut);
$buttons.forEach(el => el.addEventListener('click', showBoard));