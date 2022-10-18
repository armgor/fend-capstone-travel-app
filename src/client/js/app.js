/**
 * This function checks that date formats are valid.
 * Since I am using a date selector in the HTML, this is redundant.
 */
function isDateValid(tripDate='') {
    var res = tripDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (res === null)
        return false;
    else
        return true;
}

/**
 * Check if user entered date is in the past with respect to another date
 */
function isDateInPast(startDate=new Date('2022-01-01'), endDate=new Date()) {
    if (startDate - endDate < 0)
        return true;
    else
        return false;
}

/**
 * Computes number of dates between two dates.
 */
function daysBetweenDates(startDate=new Date('2022-01-01'), endDate=new Date('2022-01-01')) {
    return Math.round((endDate-startDate)/(1000*60*60*24));
}

/**
 * Function that pads digits with 0s. This is used for date formatting
 */
function padToDigits(num, pad) {
    return num.toString().padStart(pad, '0');
}

/**
 * Function that outputs a Date() in MM/DD/YYYY format using the padToDigits() function.
 */
function dateFormatted(aDateString) {
    let dt = new Date(aDateString);
    return [padToDigits(dt.getUTCMonth()+1, 2),
            padToDigits(dt.getUTCDate(), 2),
            dt.getUTCFullYear()].join('/')
}

/**
 * Find index in date array that's closest to dateStrToCompare
 */
function getClosestIndex(dateStrArray, dateStrToCompare) {
    // compute the difference between all array elements to the date I am comparing against
    let temp = dateStrArray.map(dateStr => Math.abs(new Date(dateStr)-new Date(dateStrToCompare)));

    // get the index with the min value
    return temp.indexOf(Math.min(...temp));
}

/**
 * Helper function to create a div containing the required info,
 * including the icon, the weather, etc.
 */
function makeWeatherElement(weatherData) {
    // create a require.context for dynamically selecting weather icons during runtime
    const imgDir = require.context('../media/weatherbit_icons/', false);
    // create a document fragment and a few elements for the info
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

/**
 * Function for making async POST requests to server
 */
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

/**
 * Function for making async GET requests to server. 
 */
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
         padToDigits, dateFormatted, getClosestIndex }