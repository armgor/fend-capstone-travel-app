/**
 * Make the required imports.
 */
const fetch = require("node-fetch")
const { isDateValid, isDateInPast, daysBetweenDates, makeAsyncServerPost, getProjectData, makeWeatherElement, dateFormatted, getClosestIndex } = require('./app')

/**
 * This updateUI function is responsible for updating the user interface after all API calls are made
 * and the results are returned to the client. The input to the function is a data object containing 
 * trip information from the user form and some calculations.
 */
async function updateUI(data) {
    
    // Make GET request to server to get project data
    const projectData = await getProjectData('/getTrip');
    // create DOM elements
    const fragment = document.createDocumentFragment();
    const tripWeatherElement = document.querySelector("#trip_weather_entries");
    const tripWeatherH2Element = document.querySelector('#trip__weather h2');

    // reset DOM Elements
    tripWeatherH2Element.innerText = '';
    tripWeatherElement.innerHTML = '';

    // If GeoNames didn't return any data (check the "ok" key), then no need to proceed
    if (!projectData.geoData.ok) {
        // alert the user
        alert(`No results found for ${data.destination}. Please try another destination.`);
        return;
    }
    
    // add the trip summary. This is highly specific to my page layout.
    const tripSummaryElement = document.querySelector("#trip__summary");
    tripSummaryElement.innerHTML = '';
    const newH2 = document.createElement('h2');
    const newP = document.createElement('p');
    newH2.innerText = 'Trip Summary';
    let tripSummary = `Your trip to <strong>${data.destination}</strong> ` +
                      `is in <strong>${data.days_to_trip}</strong> day(s), starting on ` +
                      `<strong>${dateFormatted(data.trip_start)}</strong>.<br/><br/>`;
    // add trip end duration info if user entered an end date for the trip
    if (data.trip_end !== '') {
        tripSummary = tripSummary +
                      `Your trip ends on <strong>${dateFormatted(data.trip_end)}</strong>. ` +
                      `Trip duration is <strong>${data.trip_dur}</strong> day(s).`;
    }
    // update the DOM elements
    newP.innerHTML = tripSummary;
    tripSummaryElement.appendChild(newH2);
    tripSummaryElement.appendChild(newP);

    // add the weather information
    // check if trip is more than 16 days out, in which case no weather info is displayed
    if (data.days_to_trip > 16) {
        tripWeatherH2Element.innerText = `No weather info, trip is too far out`;
    } else {
        // Add text to the h2 header element
        tripWeatherH2Element.innerText = `${data.destination}'s Weather`;
        // create elements containing weather information
        // The current weather API function will return an array with single item
        // If trip is within 7 days, than only a single item will be available
        if (projectData.weatherData.length === 1) {
            fragment.appendChild(makeWeatherElement(projectData.weatherData[0]));
        } else {
            // If here, then display the 5 days before the trip start. To accomplish this
            // find the index of the objects closest to the trip start date
            // extract all dates from the weather forecast data
            let dateStrArray = Object.keys(projectData.weatherData).map(x => projectData.weatherData[x]).map(x => x.day);
            // find the date index in the weather forecast closest to the trip
            let closestIndex = getClosestIndex(dateStrArray, data.trip_start);
            for (let i=closestIndex-5+1; i <= closestIndex; i++) {
                fragment.appendChild(makeWeatherElement(projectData.weatherData[i]));
            }
        }
        // add the weather info to the document
        tripWeatherElement.appendChild(fragment);
    }

    // add location image
    if (!projectData.imgData.ok)
        alert(`No picture available for ${projectData.geoData.place}.`);
    else
        document.querySelector('#trip__img img').src = projectData.imgData.img;
}

/**
 * Function to make a POST request to the server to add the trip.
 * This function will perform a few checks to ensure everything is in order.
 */
function addTrip(event) {
    event.preventDefault()

    // initialize variables by reading info from the user form
    let trip_start_date = document.getElementById('trip_start').value;
    let trip_end_date = document.getElementById('trip_end').value;
    let trip_dest = document.getElementById('trip_dest').value;
    let trip_dur = -1;
    let days_to_trip = -1;

    // Checks related to trip start date. If no start date, alert user
    if (trip_start_date === '') {
        alert('Enter trip start date');
        return;
    }
    // checks if trip date is valid. In this case since we have a date selector,
    // this is redundant
    if (!isDateValid(trip_start_date)) {
        alert('Enter trip start date as YYYY-MM-DD');
        return;
    }
    // Check if trip start date is in the past, and alert user
    if (isDateInPast(new Date(trip_start_date))) {
        alert('Trip start date cannot be in the past.');
        return;
    }
    // Check if trip destination is empty, and alert user
    if (trip_dest === '') {
        alert('Enter trip destination');
        return;
    }
    // Check destination end date, if not missing or not before start date, 
    // calculate trip duration
    if (trip_end_date !== '') {
        if (!isDateValid(trip_end_date)) {
            alert('Enter trip end date as YYYY-MM-DD');
            return;
        }
        if (isDateInPast(new Date(trip_end_date), new Date(trip_start_date))) {
            alert('Trip end date must be after trip start date.');
            return;
        }
        // compute the trip duration if trip_end_date is provided
        trip_dur = daysBetweenDates(new Date(trip_start_date), new Date(trip_end_date));
    }

    // compute how many days away the trip is
    days_to_trip = daysBetweenDates(new Date(), new Date(trip_start_date));

    // init object with all collected data
    const data = {
        'destination': trip_dest.trim(),
        'days_to_trip': days_to_trip,
        'trip_start': trip_start_date,
        'trip_end': trip_end_date,
        'trip_dur': trip_dur
    }

    // make post request and call the updateUI() function
    makeAsyncServerPost('http://localhost:8081/addTrip', data)
    .then(function(res) {
        updateUI(data);
    })
}

// export the functions
export { addTrip, updateUI }