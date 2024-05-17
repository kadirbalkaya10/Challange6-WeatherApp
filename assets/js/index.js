const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const searchResultList = document.querySelector("#searchResultList");
const cardContainer = document.querySelector("#cardContainer");

// const apiUrl = `api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=f6e57c4912c34be01153c0ddd7de17be`;
// const apiUrl2 = `http://api.openweathermap.org/geo/1.0/direct?q=${City}&limit=5&appid=f6e57c4912c34be01153c0ddd7de17be`;

const handleSearchClick = (e) => {
  e.preventDefault();
  localStorage.setItem("search", []);
  userInput = searchInput.value;
};

searchForm.addEventListener("submit", handleSearchClick);
