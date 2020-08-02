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