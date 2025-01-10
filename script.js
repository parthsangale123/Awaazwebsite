const API_KEY = "3507e5a2ef7c4a78a8a50359251001"; 


async function getWeather() {
  let city = document.getElementById("cityInput").value.trim();
  if (!city) {
    city = "Kharagpur"; 
  }

  const urlCurrent = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
  const urlForecast = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(urlCurrent),
      fetch(urlForecast),
    ]);

    if (!currentResponse.ok) {
      throw new Error(`Current Weather API Error: ${currentResponse.status}`);
    }

    if (!forecastResponse.ok) {
      throw new Error(`Forecast Weather API Error: ${forecastResponse.status}`);
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    updateWeatherDetails(currentData, forecastData);
    updateMap(currentData);
  } catch (error) {
    console.error("Error:", error);
    alert("Could not fetch weather data. Please try again.");
  }
}


function updateWeatherDetails(currentData, forecastData) {
  const { location, current } = currentData;
  const { forecast } = forecastData;
  const forecastDay = forecast.forecastday[0];

  const highTemp = forecastDay.day.maxtemp_c;
  const lowTemp = forecastDay.day.mintemp_c;
  const moonPhase = forecastDay.astro.moon_phase;
  const dewPoint = current.dewpoint_c || "N/A";
  const hourly = forecastDay.hour;


  document.getElementById("Details").innerHTML = `
    <p>${location.name}, ${location.region} as of ${current.last_updated}</p>
    <h1>${current.temp_c}°C</h1>
    <h2>${current.condition.text}</h2>
    <h3>Feels like ${current.feelslike_c}°C</h3>
  `;

  document.getElementById("Weather").innerHTML = `

    <table>
      <tr>
        <td>
          <table id="left">
            <tr><td>High/Low</td><td>${highTemp}°C / ${lowTemp}°C</td></tr>
            <tr><td>Humidity</td><td>${current.humidity}%</td></tr>
            <tr><td>Pressure</td><td>${current.pressure_mb} mb</td></tr>
            <tr><td>Visibility</td><td>${current.vis_km} km</td></tr>
          </table>
        </td>
        <td>
          <table id="right">
            <tr><td>Wind</td><td>${current.wind_kph} kph</td></tr>
            <tr><td>Dew Point</td><td>${dewPoint}°C</td></tr>
            <tr><td>UV Index</td><td>${current.uv} of 11</td></tr>
            <tr><td>Moon Phase</td><td>${moonPhase}</td></tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  document.getElementById("todayforecast").innerHTML = `
    <h2>Today's Forecast</h2>
    <table>
      <tr>
        <td>Morning</td>
        <td>${hourly[9].temp_c}°C</td>
        <td>${hourly[9].condition.text}</td>
        <td>${hourly[9].chance_of_rain}% Rain</td>
      </tr>
      <tr>
        <td>Afternoon</td>
        <td>${hourly[12].temp_c}°C</td>
        <td>${hourly[12].condition.text}</td>
        <td>${hourly[12].chance_of_rain}% Rain</td>
      </tr>
      <tr>
        <td>Evening</td>
        <td>${hourly[18].temp_c}°C</td>
        <td>${hourly[18].condition.text}</td>
        <td>${hourly[18].chance_of_rain}% Rain</td>
      </tr>
      <tr>
        <td>Overnight</td>
        <td>${hourly[0].temp_c}°C</td>
        <td>${hourly[0].condition.text}</td>
        <td>${hourly[0].chance_of_rain}% Rain</td>
      </tr>
    </table>
  `;
}


function updateMap(currentData) {
  const { location } = currentData;
  const mapContainer = document.getElementById("map");


  while (mapContainer.firstChild) {
    mapContainer.removeChild(mapContainer.firstChild);
  }

  const map = document.createElement("iframe");
  map.setAttribute(
    "src",
    `https://www.openstreetmap.org/export/embed.html?bbox=${location.lon - 0.1},${location.lat - 0.1},${location.lon + 0.1},${location.lat + 0.1}&layer=mapnik&marker=${location.lat},${location.lon}`
  );
  map.setAttribute("width", "100%");
  map.setAttribute("height", "600");
  map.setAttribute("style", "border:0;");
  map.setAttribute("allowfullscreen", "");
  map.setAttribute("loading", "lazy");

  mapContainer.appendChild(map);
}

document.querySelector("button").addEventListener("click", getWeather);

getWeather();
