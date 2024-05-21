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

// FetchForecast data
function fetchForecast(data) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${data.lat}&lon=${data.lon}&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((forecastData) => {
      forecastEl.innerHTML = "";
      forecastData.list.forEach((weather) => {
        const time = new Date(weather.dt_txt);
        if (time.getHours() === 12) {
          createWeatherElement({
            time: time.toLocaleDateString(),
            temp: weather.main.temp,
            wind: weather.wind.speed,
            humidity: weather.main.humidity,
            icon: weather.weather[0].icon,
            desc: weather.weather[0].description,
          });
        }
      });
    })
    .catch((error) => console.error("Error fetching forecast data:", error));
}

// Display WeatherData
function displayWeatherData(cityName, data) {
  searchResultList.innerHTML = `
    <li class="list-group-item fs-2">${cityName} Weather</li>
    <li class="list-group-item">Temp: ${data.main.temp}°F</li>
    <li class="list-group-item">Wind: ${data.wind.speed} m/h</li>
    <li class="list-group-item">Humidity: ${data.main.humidity}%</li>
  `;
}

// Create weather element for cards
function createWeatherElement(data) {
  const weatherEl = document.createElement("div");
  weatherEl.className = "card text-bg-primary m-3";
  weatherEl.style.maxWidth = "18rem";

  const header = document.createElement("div");
  header.className = "card-header";
  header.textContent = data.time;
  weatherEl.appendChild(header);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = `Temp: ${data.temp}°F`;
  body.appendChild(title);

  const wind = document.createElement("p");
  wind.className = "card-text";
  wind.textContent = `Wind: ${data.wind} MPH`;
  body.appendChild(wind);

  const humidity = document.createElement("p");
  humidity.className = "card-text";
  humidity.textContent = `Humidity: ${data.humidity}%`;
  body.appendChild(humidity);

  const desc = document.createElement("p");
  desc.className = "card-text";
  desc.textContent = data.desc;
  body.appendChild(desc);

  if (data.icon) {
    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    body.appendChild(icon);
  }

  weatherEl.appendChild(body);
  forecastEl.appendChild(weatherEl);
}

// Adding prev search to history but only keep the 5 items to show only last 5 search
function addHistory(data) {
  let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
  history = history.filter(
    (city) => city.lat !== data.lat && city.lon !== data.lon
  );
  history.unshift(data);
  if (history.length > 5) {
    history.pop();
  }
  localStorage.setItem("cityHistory", JSON.stringify(history));
  renderHistory();
}

// Display search history
function renderHistory() {
  const history = JSON.parse(localStorage.getItem("cityHistory")) || [];
  prevSearch.innerHTML = '<h1 class="fs-3 mb-3">History</h1>';
  history.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-group-item list-group-item-action";
    button.textContent = `${city.city}`;
    button.addEventListener("click", () => fetchCityWeather(city));
    prevSearch.appendChild(button);
  });
}
