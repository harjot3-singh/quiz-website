const DOMElements = {
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    weatherCard: document.getElementById('weather-card'),
    errorMessage: document.getElementById('error-message'),
    cityName: document.getElementById('city-name'),
    dateCurrent: document.getElementById('date-current'),
    temp: document.getElementById('temp'),
    weatherDescription: document.getElementById('weather-description'),
    weatherIcon: document.getElementById('weather-icon'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    pressure: document.getElementById('pressure')
};

DOMElements.searchBtn.addEventListener('click', handleSearch);
DOMElements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = DOMElements.cityInput.value.trim();
    
    if (city === '') {
        showError('Please enter a city name.');
        return;
    }

    fetchWeatherData(city);
}

async function fetchWeatherData(city) {
    hideError();
    DOMElements.weatherCard.style.display = 'none';
    
    try {
        DOMElements.searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching';
        DOMElements.searchBtn.disabled = true;

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) throw new Error('Failed to fetch location data.');
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`City "${city}" not found.`);
        }
        
        const location = geoData.results[0];
        
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&wind_speed_unit=ms`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather data.');
        
        const weatherData = await weatherResponse.json();
        
        updateUI(location, weatherData.current);

    } catch (error) {
        showError(error.message);
    } finally {
        DOMElements.searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search';
        DOMElements.searchBtn.disabled = false;
    }
}

function getWeatherDetails(code) {
    const weatherMap = {
        0: { desc: 'Clear sky', icon: '01d' },
        1: { desc: 'Mainly clear', icon: '02d' },
        2: { desc: 'Partly cloudy', icon: '03d' },
        3: { desc: 'Overcast', icon: '04d' },
        45: { desc: 'Fog', icon: '50d' },
        48: { desc: 'Depositing rime fog', icon: '50d' },
        51: { desc: 'Light drizzle', icon: '09d' },
        53: { desc: 'Moderate drizzle', icon: '09d' },
        55: { desc: 'Dense drizzle', icon: '09d' },
        56: { desc: 'Light freezing drizzle', icon: '09d' },
        57: { desc: 'Dense freezing drizzle', icon: '09d' },
        61: { desc: 'Slight rain', icon: '10d' },
        63: { desc: 'Moderate rain', icon: '10d' },
        65: { desc: 'Heavy rain', icon: '10d' },
        66: { desc: 'Light freezing rain', icon: '13d' },
        67: { desc: 'Heavy freezing rain', icon: '13d' },
        71: { desc: 'Slight snow fall', icon: '13d' },
        73: { desc: 'Moderate snow fall', icon: '13d' },
        75: { desc: 'Heavy snow fall', icon: '13d' },
        77: { desc: 'Snow grains', icon: '13d' },
        80: { desc: 'Slight rain showers', icon: '09d' },
        81: { desc: 'Moderate rain showers', icon: '09d' },
        82: { desc: 'Violent rain showers', icon: '09d' },
        85: { desc: 'Slight snow showers', icon: '13d' },
        86: { desc: 'Heavy snow showers', icon: '13d' },
        95: { desc: 'Thunderstorm', icon: '11d' },
        96: { desc: 'Thunderstorm with light hail', icon: '11d' },
        99: { desc: 'Thunderstorm with heavy hail', icon: '11d' },
    };
    
    return weatherMap[code] || { desc: 'Unknown', icon: '03d' };
}

function updateUI(location, current) {
    const countryStr = location.country ? `, ${location.country}` : '';
    DOMElements.cityName.textContent = `${location.name}${countryStr}`;
    DOMElements.dateCurrent.textContent = formatDate(new Date(current.time || Date.now()));
    
    const weatherDetails = getWeatherDetails(current.weather_code);
    
    DOMElements.temp.textContent = `${Math.round(current.temperature_2m)}°C`;
    DOMElements.weatherDescription.textContent = weatherDetails.desc;
    
    DOMElements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    DOMElements.humidity.textContent = `${current.relative_humidity_2m}%`;
    DOMElements.windSpeed.textContent = `${current.wind_speed_10m.toFixed(1)} m/s`;
    DOMElements.pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;

    DOMElements.weatherIcon.src = `https://openweathermap.org/img/wn/${weatherDetails.icon}@4x.png`;
    DOMElements.weatherIcon.alt = weatherDetails.desc;

    DOMElements.weatherCard.style.display = 'block';
    
    DOMElements.cityInput.value = '';
}

function showError(message) {
    DOMElements.errorMessage.textContent = message;
    DOMElements.errorMessage.style.display = 'block';
    DOMElements.weatherCard.style.display = 'none';
}

function hideError() {
    DOMElements.errorMessage.style.display = 'none';
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
