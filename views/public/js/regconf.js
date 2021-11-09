const h1 = document.querySelector('h1');
const btn = document.querySelector('button');

const czekit = (data) => {
   h1.textContent = `${h1.textContent},  ${data.imie}`;
}


const potwierdzonko = () => {
    fetch('/r/passed', {
        method: 'GET',
        
    })
    .then(res => res.json())
    .then(data => {
    czekit(data);
    })
}

// btn.setAttribute('href', 'https://localhost:3000/');

potwierdzonko();