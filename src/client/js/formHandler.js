const fetch = require("node-fetch")


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


function addTrip(event) {
    event.preventDefault()

    const data = {
        blah: 'blah'
    }

    console.log("::: Form Submitted :::")
    makeAsyncServerPost('http://localhost:8081/addTrip', data)
    .then(function(res) {
        // document.getElementById('results').innerHTML = res.message
        console.log(res)
    })
}


export { addTrip }