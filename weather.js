const input = document.querySelector("input");
const findInputBtn = document.querySelector(".find-input");
const locationexistsError = document.querySelector(".location-exists");
findInputBtn.addEventListener("click", fetchWeatherInfoByLocation);
const myLocationBtn = document.querySelector(".my-location");
myLocationBtn.addEventListener("click", getUserLocationAndFetchData);
const currentWeatherP = document.querySelector(".current-weather-p")
let currentWeather = document.querySelector(".current-weather");
const sunriseP = document.querySelector(".sunrise-p")
let sunrise = document.querySelector(".sunrise");
const sunsetP = document.querySelector(".sunset-p");
let sunset = document.querySelector(".sunset");
const searchedWeatherArr = [];

const geo = navigator.geolocation;
const weatherEndpoint = 'https://api.openweathermap.org/data/2.5/weather';

//first- displaying the weather by user location
function success(position) {
  fetchWeatherInfo(position.coords.latitude, position.coords.longitude);
}
function error() {
  console.log('Sorry, no position available.');
}
function getUserLocationAndFetchData() {
  navigator.geolocation.getCurrentPosition(success, error);
}
getUserLocationAndFetchData();

//fetching the input//
async function fetchWeatherInfo(lat = 0, lon = 0, location = "") {
  let response;
  let data;
  locationexistsError.style.display = "none";
  try {
    if (location && searchedWeatherArr.includes(location)===false) { //if searching by location
      response = await fetch(`${weatherEndpoint}?q=${location}&appid=52442a7c70c3b738415205c974a5a4bc&units=metric`);
      data = await response.json();
      const currLocationInfo = [data.name,data.main.temp];
      createLocationCard(currLocationInfo);
      searchedWeatherArr.push(data.name.toLowerCase());
    }
    else if (lat && lon) { //if searching by lat and lon
      response = await fetch(`${weatherEndpoint}?lat=${lat}&lon=${lon}&appid=52442a7c70c3b738415205c974a5a4bc&units=metric`);
      data = await response.json();
    }
    else {
      locationexistsError.style.display = "block";
    }
    console.log(data);
    //getting sunrise and sunset times//
    const sunrise = new Date((data.sys.sunrise) * 1000);
    const formattedSunriseTime = sunrise.toLocaleTimeString();
    const sunset = new Date((data.sys.sunset) * 1000);
    const formattedSunsetTime = sunset.toLocaleTimeString();

    const obj = {
      weatherInCelsius: data.main.temp + "°C",
      sunrise: formattedSunriseTime,
      sunset: formattedSunsetTime,
    }
    await displayWeatherInfo(obj);
  }
  catch (err) {
    console.log(err);
  }
}


async function createLocationCard(currLocationInfo) {
  const location = currLocationInfo[0];
  const weather = currLocationInfo[1];
  console.log(weather);
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");
  const cardInfo = document.createElement("h4");
  cardInfo.classList.add("card-info");
  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon");
  if (weather < 15) {
    console.log("in if");
    weatherIcon.src = "./rain.png";
  }
  else if (weather < 20) {
    console.log("in elif");
    weatherIcon.src = "./clouds.png";
  }
  else {
    console.log("in else");
    weatherIcon.src = "./sun.png";
  }
  cardInfo.textContent = `${location} ${weather + "°C"}`;
  cardContainer.appendChild(cardInfo);
  cardContainer.appendChild(weatherIcon);
  document.body.appendChild(cardContainer);
}


async function fetchWeatherInfoByLocation(event) { //getting user input and sending it to fetchWeatherInfo()
  try {
    const location = input.value;
    fetchWeatherInfo(0, 0, location);
  }
  catch (err) {
    console.log(err);
  }
}

async function displayWeatherInfo(obj) { //display weather
  try {
    currentWeather.textContent = obj.weatherInCelsius;
    sunrise.textContent = obj.sunrise;
    sunset.textContent = obj.sunset;

    currentWeatherP.appendChild(currentWeather);
    sunriseP.appendChild(sunrise);
    sunsetP.appendChild(sunset);

  }
  catch (err) {
    console.log(err);
  }
}


//first- displaying the weather by user location
// async function getUserLocationAndFetchData() {
//   try {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const lat = position.coords.latitude;
//       const lon = position.coords.longitude;
//       // console.log(position);
//       fetchWeatherInfo(lat, lon);
//     });
//   }
//   catch(err) {
//     console.log(err);
//   }
// }
// getUserLocationAndFetchData();