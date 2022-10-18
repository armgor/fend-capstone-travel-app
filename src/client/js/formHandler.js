const fetch = require("node-fetch")
const { isDateValid, isDateInPast, daysBetweenDates, makeAsyncServerPost, getProjectData, makeWeatherElement, dateFormatted } = require('./app')

async function updateUI(data) {
    
    const projectData = await getProjectData('/getTrip');

    // check if GeoNames returned data, i.e. if the place name was found
    if (!projectData.geoData.ok) {
        alert(`No results found for ${data.destination}. Please try another destination.`);
        return;
    }
    
    // add the trip summary
    const tripSummaryElement = document.querySelector("#trip__summary");
    tripSummaryElement.innerHTML = '';
    const newH2 = document.createElement('h2');
    const newP = document.createElement('p');
    newH2.innerText = 'Trip Summary';
    let tripSummary = `Your trip to <strong>${projectData.geoData.place}</strong> ` +
                      `is in <strong>${data.days_to_trip}</strong> day(s), starting on ` +
                      `<strong>${dateFormatted(data.trip_start)}</strong>.<br/><br/>`;
    // add trip end duration info
    if (data.trip_end !== '') {
        tripSummary = tripSummary + 
                      `Your trip ends on <strong>${dateFormatted(data.trip_end)}</strong>. ` +
                      `Trip duration is <strong>${data.trip_dur}</strong> day(s).`;
    }
    newP.innerHTML = tripSummary;
    tripSummaryElement.appendChild(newH2);
    tripSummaryElement.appendChild(newP);

    // <h2>Trip Summary</h2>

    // TODO - check if trip is 16 days away
    // TODO - get the last 5 days only, not first 5 days
    // TODO - dynamically add weather information
    // TODO - document code and write ReadME

    // add the weather information
    const fragment = document.createDocumentFragment();
    const tripWeatherElement = document.querySelector("#trip_weather_entries");

    // create elements containing weather information
    for (let i=0; i < Math.min(5, projectData.weatherData.length); i++) {
        fragment.appendChild(makeWeatherElement(projectData.weatherData[i]))
    }

    tripWeatherElement.innerHTML = '';
    tripWeatherElement.appendChild(fragment);

    // add location image
    if (!projectData.imgData.ok)
        alert(`No picture available for ${projectData.geoData.place}.`);
    else
        document.querySelector('#trip__img img').src = projectData.imgData.img;
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
        updateUI(data);
    })
}


export { addTrip, updateUI }