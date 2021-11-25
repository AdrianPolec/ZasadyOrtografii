const h1 = document.querySelector('h1');
const btn = document.querySelector('button');

const check = (data) => {
    h1.textContent = `${h1.textContent},  ${data.imie}`;
}


const confirmation = () => {
    fetch('/r/passed', {
        method: 'GET',

    })
        .then(res => res.json())
        .then(data => {
            check(data);
        })
}
confirmation();