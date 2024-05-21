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
