// Dependencies
const inputSearch = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const searchResultList = document.getElementById("searchResultList");
const prevSearch = document.getElementById("prevSearch");
const forecastEl = document.getElementById("cardContainer");
const apiKey = "81f5de324935a1e9a4ba6383132f2d99";

// Search form handler
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = inputSearch.value.trim();
  if (city) {
    fetchCityCoordinates(city);
  }
});

// Fetch City Coordinates
function fetchCityCoordinates(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const { lat, lon, name, state } = data[0];
        const cityData = { lat, lon, city: name, state };
        fetchCityWeather(cityData);
        addHistory(cityData);
      } else {
        alert("City not found!");
      }
    })
    .catch((error) => console.error("Error fetching city coordinates:", error));
}

// FetchCityWeather using fetchCoordinates function to get city coordinates and use as parameter in another api request
function fetchCityWeather(data) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((weatherData) => {
      displayWeatherData(data.city, weatherData);
    })
    .catch((error) => console.error("Error fetching weather data:", error));

  fetchForecast(data);
}
