import { checkForName } from './js/nameChecker'
import { addTrip } from './js/formHandler'
import img from './media/confused_dog.jpg'

const myImg = new Image();
myImg.src = img;
document.querySelector("#trip__img").appendChild(myImg);

import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/resets.scss'
import './styles/main.scss'

// console.log(checkForName);

export { addTrip }

// alert("I EXIST")
console.log("CHANGE!!");
