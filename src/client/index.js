import { addTrip, updateUI } from './js/formHandler'
import img from './media/confused_dog.jpg'

const myImg = new Image();
myImg.src = img;
document.querySelector("#trip__img").appendChild(myImg);


import './styles/main.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/resets.scss'

export { addTrip, updateUI }
