const fetch = require("node-fetch")
const { isDateValid, isDateInPast, daysBetweenDates, makeAsyncServerPost, getProjectData, makeWeatherElement } = require('./app')

async function updateUI(data) {
    
    const projectData = await getProjectData('/getTrip');

    // check if GeoNames returned data, i.e. if the place name was found
    if (!projectData.geoData.ok) {
        alert(`No results found for ${data.destination}. Please try another destination.`);
        return;
    }
    
    // add location image
    if (!projectData.imgData.ok)
        alert(`No picture available for ${projectData.geoData.place}.`);
    else
        document.querySelector('#trip__img img').src = projectData.imgData.img;

    // TODO - check if trip is 16 days away
    // TODO - get the last 5 days only, not first 5 days
    // TODO - dynamically add weather information
    // TODO - document code and write ReadME

    // add the weather information
    const fragment = document.createDocumentFragment();
    const targetDOMElement = document.querySelector("#trip_weather_entries");

    // create elements containing weather information
    for (let i=0; i < Math.min(5, projectData.weatherData.length); i++) {
        fragment.appendChild(makeWeatherElement(projectData.weatherData[i]))
    }

    targetDOMElement.innerHTML = '';
    targetDOMElement.appendChild(fragment);
}

function addTrip(event) {
    event.preventDefault()

    let trip_start_date = document.getElementById('trip_start').value;
    let trip_end_date = document.getElementById('trip_end').value;
    let trip_dest = document.getElementById('trip_dest').value;
    let trip_dur = -1;
    let days_to_trip = -1;

    // Checks related to trip start date
    if (trip_start_date === '') {
        alert('Enter trip start date');
        return;
    }
    if (!isDateValid(trip_start_date)) {
        alert('Enter trip start date as YYYY-MM-DD');
        return;
    }
    if (isDateInPast(new Date(trip_start_date))) {
        alert('Trip start date cannot be in the past.')
        return;
    }
    // Check if trip destination is empty
    if (trip_dest === '') {
        alert('Enter trip destination')
        return;
    }
    // Check destination end date
    if (trip_end_date !== '') {
        if (!isDateValid(trip_end_date)) {
            alert('Enter trip end date as YYYY-MM-DD');
            return;
        }
        if (isDateInPast(new Date(trip_end_date), new Date(trip_start_date))) {
            alert('Trip end date must be after trip start date.')
            return;
        }
        // compute the trip duration if trip_end_date is provided
        trip_dur = daysBetweenDates(new Date(trip_start_date), new Date(trip_end_date));
    }

    // compute how many days away the trip is
    days_to_trip = daysBetweenDates(new Date(), new Date(trip_start_date))

    console.log(trip_start_date)
    console.log(trip_end_date)
    console.log(trip_dur)
    console.log(trip_dest.trim())
    console.log(days_to_trip)

    const data = {
        'destination': trip_dest.trim(),
        'days_to_trip': days_to_trip,
        'trip_start': trip_start_date,
        'trip_end': trip_end_date,
        'trip_dur': trip_dur
    }

    makeAsyncServerPost('http://localhost:8081/addTrip', data)
    .then(function(res) {
        // document.getElementById('results').innerHTML = res.message
        // if (!res.ok) {
        //     alert(`No results found for ${trip_dest}. Please enter another trip destination.`)
        //     return;
        // }
        console.log(res);
        updateUI(data);
    })
}


export { addTrip, updateUI }