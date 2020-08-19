// Declaration of variables
const APIkey = "&appid=29d9121dacef0624c94a4b33f6e86502";
const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const uvURL = "https://api.openweathermap.org/data/2.5/uvi?";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";

let cities = localStorage.getItem("cities");
    if (!cities) {
        cities = [];
    }
    else
    {
        cities = cities.split(",")
    };

// Search history that stores the cities that have been searched for easy, quick access
$("#search").on("click", function() {
    event.preventDefault();
    event.stopPropagation();
    let city = $("#city-input").val().trim();
    if (city != '') {
        // The following clears the error if something is typed incorrectly in the search box
        $("#city-input").html("")
        searchCity(city);
        forecast(city);
        addHistory(city);
        renderHistory()
    }
    else {
        $("#city-input").html("Field cannot be empty");
    }
});
// Save the cities searched
function addHistory(city){ 
    cities.push(city);
    localStorage.setItem("cities", cities); 
};

// Render the cities to local storage
function renderHistory(){
    $("#history").empty();
    for (i = 0; i < cities.length; i++) {
        
        $("#history").append($("<button class='btn btn-info d-flex flex-column'>").attr("cityName", cities[i]).text(cities[i]));
    }
    $("#history button").on("click",function(){
        event.preventDefault();
        let searchedCity = $(this).attr("cityName");
        // This queries the ajax function to return the city.
        searchCity(searchedCity);
        forecast(searchedCity);
    });
};

// Function to show Farenheit to Celcious
function fToC(fahrenheit) {
    const fTemp = Math.round(fahrenheit);
    const fToCel = Math.round((fTemp - 32) * 5 / 9);
    const temp = `${fTemp}\xB0F : ${fToCel}\xB0C.`;
    return temp;    
 }

function searchCity(city){
    
    $.ajax({
        url: queryURL+city+APIkey+"&units=imperial",
        method: "GET"
    }).then(function(response){
        // Setting variables for weather results 
        // Display the current search on main div
        $("#cityName").attr("class", "nowrap").text(city);
        let tempT = $("#temperature").attr("class", "nowrap");
        $("#humidity").attr("class", "nowrap").text("Humidity: "+ response.main.humidity + "%");
        $("#windSpeed").attr("class", "nowrap").text("Wind Speed: " + response.wind.speed + " MPH");
        
        // Get the date and time and set it
        let today = new Date();
        let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;

        // Displaying the date when the city is selected.
        $("#currentDate").text(dateTime);

        // Declaring the function F to C
        let cTemp = fToC(response.main.temp);

        // Show Temperature on main div
        tempT.text("Temperature: "+ cTemp);

        // Variables for ajax call for UV response
        getUV(response.coord.lat, response.coord.lon)      
    });
}

function getUV(lat, lon) {
    $.ajax({
        url: uvURL+"&lat="+lat+"&lon="+lon+APIkey,
        method: "GET"
    }).then(function (response) {

        // Create variable to get the UV and to create dom element on div.
        let uv = response.value;
        $("#uvIndex").empty(); // clear the element first
        $("#uvIndex").append($("<div id=\"uvColor\">").text("Uv Index: " + uv)).attr("class", "nowrap");
        // When checking the UV create a color that shows whether the conditions are good, moderate, or bad
        if(uv <= 3){
            //change color to green
            $("#uvColor").attr("style", "background-color:green ; width:65%");
        }
        else if( uv <= 7){
            //change color to yellow
            $("#uvColor").attr("style", "background-color:yellow ; width:65%");
        }
        else{
            //change color to red
            $("#uvColor").attr("style", "background-color:red ; width:65%");
        };        
    })    
}

// Display the future weather conditions for the searched city and show a 5-day forecast that displays the date, an icon representation of weather conditions, wind, UV, temperature, and humidity
function forecast(city) {
    // Section for the 5 day query
    $.ajax({
        url: forecastURL+ city + APIkey+"&units=imperial",
        method: "GET"
        // forecastFunction
    }).then(function(forecastResponse){       
        // Creating  a filter for the 5 days
        let filteredDays = forecastResponse.list.filter(
            function (currentElement){
            return currentElement.dt_txt.includes("12:00:00")
            }	
        );

        // Creating the HTML elements to display the forecast
        $("#forecast").empty();
        for(let i = 0; i < filteredDays.length; i++ ){
             console.log("in the for loop");

            // Declaring the function for F to C
            let cTemp = fToC(filteredDays[i].main.temp);
            let tempT = cTemp;
            
            // Creating variables that hold the array of data from the filteredDays function above
            let date = filteredDays[i].dt_txt.split(" ")[0];
            let icon = filteredDays[i].weather[0].icon;
            let humidity = filteredDays[i].main.humidity;
            
            // Creating and adding classes and attributes to HTML elements.
            let square = $("<div>").attr("class","square");
            let section = $("<section>").attr("class","content").attr("class", "col-sm-3");
            let list = $("<ul>");
            let listElDates = $("<li>").attr("class","dates").attr("class", "nowrap").text(date);
            let listIcon = $("<ul>").append($("<img>").addClass("weatherImg").attr("src", "https://openweathermap.org/img/w/" + icon + ".png"));
            let listElTempF = $("<li>").attr("class", "tempForecast").attr("class", "nowrap").text("Temp: " + tempT);
            let listElHumidityF = $("<li>").attr("class", "humidityForecast").attr("class", "nowrap").text("Humidity: " + humidity); 
             
            // Appending all html elements together to form the buttons with the forecast
            square.append(section.append(list.append(listElDates,listIcon,listElTempF,listElHumidityF)))
             $("#forecast").append(square)
        }    
    })
};

// First onload DOM
searchCity(localStorage.getItem("cities").split(",")[localStorage.getItem("cities").split(",").length-1]);
renderHistory();
forecast(localStorage.getItem("cities").split(",")[localStorage.getItem("cities").split(",").length-1]);