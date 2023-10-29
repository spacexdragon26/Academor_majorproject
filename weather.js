var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 15,
    freeMode: true,
  });
  
  //working on weather updates
  const searchBtn = document.querySelector('.searchBtn');
  const cityNameInput = document.querySelector('.citySearch');
  const apiKey = 'a3c616583e96ff9398c961b2a21bbe16';
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const WeatherDegree = document.querySelector('.weatherInput');
  const locationData = document.querySelector('.location-data');
  const weatherPallete = document.querySelector('.weather-pallete');
  const weatherUL = document.querySelector('.weather-ul');
  const weatherIcon = document.querySelector('#weatherIcon');
  const defaultLat = 28.6139; // Delhi's latitude
  const defaultLon = 77.2090; // Delhi's longitude  
  const gettingStartedBtn = document.querySelector('.getting-started-btn');
  
  gettingStartedBtn.addEventListener('click', function () {
    document.querySelector('.frontpage').classList.add('active');
    document.querySelector('.weather-container').classList.add('active');
  })

  function fetchDefaultWeatherData() {
    const weather_api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${defaultLat}&lon=${defaultLon}&appid=${apiKey}`;
  
    fetch(weather_api_url)
      .then((res) => res.json())
      .then((data) => {
        const cityName = data.city.name; // Get Delhi's city name from the data
        // Call your function to display the weather data here
        gettingWeatherDetails(cityName, defaultLat, defaultLon);
      })
      .catch(() => {
        alert('Error Occurred While Fetching Weather Data for Delhi');
      });
  }

  fetchDefaultWeatherData();
  
  // creating a function named createWeatherCard
  function createWeatherCard(cityName2, weatherItem2, index2) {
    if (index2 === 0) {
      // Current weather card
      const weatherMain = weatherItem2.weather[0].main;
      const imageSource = getImageSource(weatherMain);
  
      return `
        <div class="location-data">
          <div class="location-content">
            <i class='bx bxs-map'></i>
            <h3>${cityName2}</h3>
          </div>
          <p>${weatherItem2.dt_txt.split(' ')[0]}</p>
        </div>
        <div class="weather-Degree">
          <h1>${Math.round(weatherItem2.main.temp - 273.15)}°</h1>
          <img src="${imageSource}" alt="weather-Degree-image" class="weather-Degree-img">
          <h2>${weatherItem2.weather[0].description}</h2>
        </div>
        <div class="weather-pallete">
          <div class="pallete-data">
            <i class='bx bx-water'></i>
            <small>${weatherItem2.main.pressure} M/B</small>
            <span>Pressure</span>
          </div>
          <div class="pallete-data">
            <i class='bx bxs-droplet-half' ></i>
            <small>${weatherItem2.main.humidity}%</small>
            <span>Humidity</span>
          </div>
          <div class="pallete-data">
            <i class='bx bx-wind' ></i>
            <small>${weatherItem2.wind.speed} M/S</small>
            <span>wind Speed</span>
          </div>
        </div>
      `;
    } else {
      // Forecast weather card
      const imageSource = getImageSource(weatherItem2.weather[0].main);
  
      return `
        <li class="swiper-slide weather-data">
          <span>${weatherItem2.dt_txt.split(' ')[0]}</span>
          <img src="${imageSource}" alt="forecast-image" class="forecast-img">
          
          <div class="icon-overlay"></div>
          <small>Temperature ${Math.round(weatherItem2.main.temp - 273.15)}°</small>
          <small>Humidity ${weatherItem2.main.humidity}%</small>
          <small>Pressure ${weatherItem2.main.pressure} M/B</small>
        </li>
      `;
    }
  }
  
  function getImageSource(weatherMain) {
    // You can map different weather conditions to image URLs here
    switch (weatherMain) {
      case 'Clouds':
        return 'images/clouds.png';
      case 'Clear':
        return 'images/clear.png';
      case 'Drizzle':
        return 'images/drizzle.png';
      case 'Mist':
        return 'images/mist.png';
      case 'Rain':
        return 'images/rain.png';
      case 'Snow':
        return 'images/snow.png';
      default:
        return 'images/unknown.png';
    }
  }
  
  function getWeatherIcon(weatherMain) {
    if (weatherMain == "Clouds") {
      return "images/clouds.png";
    } else if (weatherMain == "Clear") {
      return "images/clear.png";
    } else if (weatherMain == "Drizzle") {
      return "images/drizzle.png";
    } else if (weatherMain == "Rain") {
      return "images/rain.png";
    } else if (weatherMain == "Snow") {
      return "images/snow.png";
    } else {
      return "images/unknown.png";
    }
  }
  
  //creating a function named gettingWeatherDetails
  function gettingWeatherDetails(cityWeather, lat, lon) {
    const weather_api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    fetch(weather_api_url)
      .then(res => res.json())
      .then(data => {
        const forecastDays = [];
        const fiveDaysForecast = data.list.filter(function (forecast) {
          const forecastdate = new Date(forecast.dt_txt).getDate();
          if (!forecastDays.includes(forecastdate)) {
            return forecastDays.push(forecastdate);
          }
        });
  
        cityNameInput.value = "";
        WeatherDegree.innerHTML = "";
        locationData.innerHTML = "";
        weatherPallete.innerHTML = "";
        weatherUL.innerHTML = "";
  
        fiveDaysForecast.forEach(function (weatherItem, index) {
          if (index === 0) {
            WeatherDegree.insertAdjacentHTML('beforeend', createWeatherCard(cityWeather, weatherItem, index));
          } else {
            weatherUL.insertAdjacentHTML('beforeend', createWeatherCard(cityWeather, weatherItem, index));
          }
        });
  
      })
      .catch(() => {
        alert('Error Occurred While Fetching the Coordinates of Weather');
      });
  }
  
  //working on search Button
  searchBtn.addEventListener('click', function () {
    const cityName = cityNameInput.value.trim();
    if (cityName == "") {
      alert("Please Enter the City Name");
      return;
    } else {
      const geocoding_api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
      fetch(geocoding_api_url)
        .then(res => res.json())
        .then(data => {
          if (!data.length) {
            return alert(`${cityName} isn't a valid city Name`);
          } else {
            const { name, lat, lon } = data[0];
            gettingWeatherDetails(name, lat, lon);
          }
  
        })
        .catch(() => {
          alert("Error Occurred While Fetching the Coordinates");
        })
    }
  })
  