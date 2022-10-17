/**
 * Function to validate date formats and values
 */
function isDateValid(tripDate='') {
    var res = tripDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (res === null)
        return false;
    else
        return true;
}

function isDateInPast(startDate=new Date('2022-01-01'), endDate=new Date()) {
    if (startDate - endDate < 0)
        return true;
    else
        return false;
}

function daysBetweenDates(startDate=new Date('2022-01-01'), endDate=new Date('2022-01-01')) {
    return Math.round((endDate-startDate)/(1000*60*60*24));
}

function padToDigits(num, pad) {
    return num.toString().padStart(pad, '0');
}

function dateFormatted(aDateString) {
    let dt = new Date(aDateString);
    return [padToDigits(dt.getUTCMonth()+1, 2),
            padToDigits(dt.getUTCDate(), 2),
            dt.getUTCFullYear()].join('/')
}

function makeWeatherElement(weatherData) {
    // create a document fragment and a few elements for the info
    const imgDir = require.context('../media/weatherbit_icons/', false);
    const newDiv = document.createElement('div');
    const newP1 = document.createElement('p');
    const newP2 = document.createElement('p');
    const weatherIconImg = new Image();

    // get weather icon image
    weatherIconImg.src = imgDir(`./${weatherData.icon}.png`).default

    // check if object has "day" key, which means it's a forecast
    if (weatherData['day'] == undefined) {
        // we have current weather data
        newP1.innerHTML = `${weatherData.temp}F`;
        newP2.textContent = 'Currently';
    } else {
        // we have forecast weather data
        newP1.innerHTML = `L: ${weatherData.low}F<br/>H: ${weatherData.high}F`;
        newP2.textContent = dateFormatted(weatherData.day);        
    }
    
    newDiv.classList.add('trip_weather_entry');
    newP1.classList.add('trip_weather_entry_temp');
    newP2.classList.add('trip_weather_entry_date');
    newDiv.appendChild(newP2);
    newDiv.appendChild(weatherIconImg);
    newDiv.appendChild(newP1);

    return newDiv
}

const makeAsyncServerPost = async(url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    try {
        const server_response = await response.json();
        // console.log(server_response);
        return server_response;
    } catch (error) {
        console.log('error: ', error)
    }
};

const getProjectData = async (url = '') => {
    const request = await fetch(url);
    try {
        const projectData = await request.json();
        return projectData;
    } catch (error) {
        console.log("error", error);
    }
};

export { isDateInPast, isDateValid, daysBetweenDates, 
         makeAsyncServerPost, getProjectData, makeWeatherElement,
         padToDigits, dateFormatted }