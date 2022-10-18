import { addTrip, updateUI } from './js/formHandler'
import img from './media/confused_dog.jpg'

const myImg = new Image();
myImg.src = img;
document.querySelector("#trip__img").appendChild(myImg);

const wimg = ['t03d', 'r02d', 'c03d', 'r03d', 'c01d']

const fragment = document.createDocumentFragment();

for (let i=0; i < wimg.length; i++) {
    const newDiv = document.createElement('div');
    const newP = document.createElement('p');
    const newP2 = document.createElement('p');
    newP2.textContent = '01/01/2022'
    newP.innerHTML = 'L: 75F<br/>H: 100F';
    const myImg = new Image();
    import(`./media/weatherbit_icons/${wimg[i]}.png`)
    .then(src => myImg.src = src.default)
    .catch(err => console.error(err))
    newDiv.classList.add('trip_weather_entry');
    newP2.classList.add('trip_weather_entry_date');
    newP.classList.add('trip_weather_entry_temp');
    newDiv.appendChild(newP2);
    newDiv.appendChild(myImg);
    newDiv.appendChild(newP);
    fragment.appendChild(newDiv);
}
document.querySelector("#trip_weather_entries").appendChild(fragment);


import './styles/main.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/resets.scss'

export { addTrip, updateUI }
