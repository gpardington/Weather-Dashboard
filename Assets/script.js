// Declaration of variables
let cities = localStorage.getItem("cities");
if (!cities) {
    cities = [];
}
else
{
    cities = cities.split(",")
};
