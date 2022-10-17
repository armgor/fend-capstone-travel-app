const fetch = require("node-fetch")
const { isDateValid, isDateInPast, daysBetweenDates } = require('./app')


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

async function updateUI() {
    const projectData = await getProjectData('/getTrip');

    // check if GeoNames returned data, i.e. if the place name was found
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
        'days_to_trip': days_to_trip
    }

    makeAsyncServerPost('http://localhost:8081/addTrip', data)
    .then(function(res) {
        // document.getElementById('results').innerHTML = res.message
        // if (!res.ok) {
        //     alert(`No results found for ${trip_dest}. Please enter another trip destination.`)
        //     return;
        // }
        console.log(res)
        updateUI()
    })
}


export { addTrip, updateUI }