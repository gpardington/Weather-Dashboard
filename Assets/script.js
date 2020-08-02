// Declaration of variables
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
        //    
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
// API. Display the city name, the date, and an icon representing the weather conditions, temperature, humidity, wind speed, and the UV index.
function searchCity(city){
    
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=29d9121dacef0624c94a4b33f6e86502";
    
$.ajax({
    url: queryURL,
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

    // Show Temperature on main div
    tempT.text("Temperature: "+ cTemp);

    // Variables for ajax call for UV response
    let cityLat = response.coord.lat;
    let cityLon = response.coord.lon;
    let uvURL = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/uvi?appid=" + "29d9121dacef0624c94a4b33f6e86502" + "&lat=" + cityLat + "&lon=" + cityLon + "&units=imperial";
    $.ajax({
        url: uvURL,
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
    })
 };
// Display the future weather conditions for the searched city and show a 5-day forecast that displays the date, an icon representation of weather conditions, wind, UV, temperature, and humidity
function forecast(city) {
    // Section for the 5 day query
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=3d16044a2eba4d271046d70fd1f2c155";
    $.ajax({
        url: queryURL,
        method: "GET"
        // forecastFunction
    }).then(function(forecastResponse){
        // Creating  a filter for the 5 days
        let filteredDays = forecastResponse.list.filter(
            function (currentElement){
            return currentElement.dt_txt.includes("12:00:00")
            }	
        );
