## Project Intro

The capstone project consolidated all I have learned in this ND program. This project was an excellent learning opportunity.

In this project I have built a Travel App according to the requirements. For the additional requirements I added the following:
* Allow user to enter an end date and compute the trip duration
* Pulled in multiple days of forecast
* Incorporate icons into the forecast

## Description

The project has been implemented according to requirements. There are two separate configuration files, one for production mode and one for development mode. 

The _package.json_ file contains all the dependencies, and defines four scripts that can be invoked at the command prompt.

+ **build-dev**: this script can be started with the ```npm run build-dev``` command, which will build and start the webpack server on the local host on port 8080.
+ **build-prod**: this script can be started with the ```npm run build-prod``` command, which will build the production version of the project, create the _dist_ directory and create all necessary files.
+ **start**: this script can be run with the ```npm start``` command after the production build has been built. This script will start the production server defined in the _index.js_ script in the _src/server_ directory. After the server is started, localhost:8081 will serve the default page, ready for user interaction.
+ **test**: the final script is the unit test script. Testing of the javascript modules can be initiated using the  ```npm test``` command.

## Testing

See above for initiating unit testing. There are currently 10 tests defined. These tests cover almost all functions I have created to ensure accuracy of results.

## Production Build

See above for building and starting the production server. Once the server is running and the home page is loaded in a browser tab, the user can interact with the basic webform. The initial page will start with a default placeholder image. 

The user interacts with the webform by entering a trip destination (city or place name), a trip start date and an optional trip end date. When all the information is entered, the user must click the **submit trip info** button. Before any API calls are made, the client side JS code will perform some basic checks:
* Check if trip destination is blank
* Check if trip start date is blank
* Check if trip start date has valid format
* Check if trip start date is in the past or not
* Check if user entered a trip end date, and perform calculations if applicable.

If all the checks pass, the client side code makes a *POST* request to the server passing the user form information.

The server will make all the required API calls and store all the data into a single object on the backend. Another *GET* request to the server is required to retrieve the stored data. The **updateUI()** function will make the *GET* request to retrieve the data and update the user interface.

The server performs the API calls in the following sequence:
1. GeoNames API call to retrive Lat and Lon for the trip destination. If no results are found, the server will return back to the client with a flag set to *false*.
2. If the GeoNames API succeeds, the WeatherBit API is called next. Depending on the trip date either the Current Weather endpoint is called, or the Forecast Weather endpoint. If the trip is within seven days, then only the current weather is requested, otherwise the 16-day forecast is retrieved.
3. Finally, the Pixabay API is called requesting an image for the trip destination.

All of the data is stored in a single object and can be retrieved using a *GET* requet.

## The UI

The **updateUI()** function makes a *GET* request and retrieves the all the data. If the result indicates that GeoNames was not able to find the location, the user is alerted and the UI is not updated. If this check passes, the UI is updated. If the trip is within 7 days, a single weather icon is retrieved from the *media* directory corresponding to the results returned from WeatherBit. If the trip is within 7 and 16 days, then weather info is displayed for the 5 days prior to the trip start date. If the trip is 16 days out, no weather info is displayed.

The **updateUI()** function will also generate summary info about the trip and update the corresponding DOM elements.

## Next Steps
Consideration for future improvement.
1. The biggest issue is that the place name returned by GeoNames is most likely not what the user had in mind. GeoNames will return a large collection of results, but in this project I am using only the first entry from the results. A possible solution is adding a State, Country selector to narrow down the results.
2. Closeley related to the point above, similarly Pixabay will return an image that will not match the location GeoNames returned.

Further work is required to ensure that all API calls return consistent results for the destination the user typed.