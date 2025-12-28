document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const currentWeather = document.getElementById('current-weather');
    
    const apiKey = '7868fc1482344094bb344551252606'; 

    searchBtn.addEventListener('click', fetchWeatherData);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchWeatherData();
        }
    });

    async function fetchWeatherData() {
        const city = searchInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        showLoading();
        hideError();
        
        try {
            const currentWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
            const response = await fetch(currentWeatherUrl);
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            updateCurrentWeather(data);
            hideLoading();
            
        } catch (error) {
            hideLoading();
            showError(error.message || 'Failed to fetch weather data. Please try again.');
        }
    }

    function updateCurrentWeather(data) {
        document.getElementById('city-name').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('weather-description').textContent = data.current.condition.text;
        document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind-speed').textContent = `${data.current.wind_kph} km/h`;
        document.getElementById('pressure').textContent = `${data.current.pressure_mb} hPa`;
        document.getElementById('feels-like').textContent = `${data.current.feelslike_c}°C`;
        
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = data.current.condition.icon;
        
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    }

    function showLoading() {
        loadingElement.style.display = 'block';
        currentWeather.style.opacity = '0.5';
    }

    function hideLoading() {
        loadingElement.style.display = 'none';
        currentWeather.style.opacity = '1';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});