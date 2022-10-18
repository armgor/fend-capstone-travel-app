import { addTrip, updateUI } from './js/formHandler'
import img from './media/confused_dog.jpg'

// Start the page with a dummy image
const myImg = new Image();
myImg.src = img;
document.querySelector("#trip__img").appendChild(myImg);

// add an event listener to the submit trip info button
document.querySelector("#trip_submit").addEventListener('click', function(event) {
    addTrip(event)
})

import './styles/main.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/resets.scss'

export { addTrip, updateUI }
