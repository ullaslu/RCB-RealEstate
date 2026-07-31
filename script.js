const OPEN_WEATHER_API_KEY = '';
const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityWeatherData = {
  India: {
    Mumbai: { country: 'IN', temp: 31, condition: 'Sunny', humidity: 70, wind: 4, icon: 'sunny' },
    Delhi: { country: 'IN', temp: 35, condition: 'Hot', humidity: 40, wind: 3.5, icon: 'hot' },
    Bengaluru: { country: 'IN', temp: 26, condition: 'Partly Cloudy', humidity: 62, wind: 4.2, icon: 'partly-cloudy' },
    Chennai: { country: 'IN', temp: 33, condition: 'Humid', humidity: 78, wind: 3.6, icon: 'humid' },
    Kolkata: { country: 'IN', temp: 34, condition: 'Clear', humidity: 68, wind: 4.1, icon: 'cloudy' }
  },
  World: {
    London: { country: 'GB', temp: 18, condition: 'Cloudy', humidity: 65, wind: 5, icon: 'cloudy' },
    'New York': { country: 'US', temp: 22, condition: 'Sunny', humidity: 55, wind: 4.5, icon: 'sunny' },
    Tokyo: { country: 'JP', temp: 24, condition: 'Rainy', humidity: 78, wind: 6, icon: 'rainy' },
    Paris: { country: 'FR', temp: 20, condition: 'Partly Cloudy', humidity: 60, wind: 4.2, icon: 'partly-cloudy' },
    Sydney: { country: 'AU', temp: 17, condition: 'Windy', humidity: 58, wind: 7, icon: 'windy' }
  }
};

function escapeHtml(text) {
  return String(text).replace(/[&<>\"]/g, (match) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return map[match];
  });
}

function getWeatherIconSvg(iconName) {
  const icons = {
    sunny: `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="12" fill="#ffcb47" />
        <g stroke="#ffcb47" stroke-width="4" stroke-linecap="round">
          <line x1="32" y1="4" x2="32" y2="16" />
          <line x1="32" y1="48" x2="32" y2="60" />
          <line x1="4" y1="32" x2="16" y2="32" />
          <line x1="48" y1="32" x2="60" y2="32" />
          <line x1="12" y1="12" x2="20" y2="20" />
          <line x1="44" y1="44" x2="52" y2="52" />
          <line x1="12" y1="52" x2="20" y2="44" />
          <line x1="44" y1="20" x2="52" y2="12" />
        </g>
      </svg>
    `,
    cloudy: `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="34" rx="22" ry="14" fill="#dee5ed" />
        <ellipse cx="22" cy="28" rx="14" ry="10" fill="#c9d4e1" />
        <ellipse cx="44" cy="28" rx="14" ry="10" fill="#c9d4e1" />
      </svg>
    `,
    rainy: `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="26" rx="22" ry="14" fill="#c9d4e1" />
        <line x1="22" y1="42" x2="22" y2="54" stroke="#4da6ff" stroke-width="4" stroke-linecap="round" />
        <line x1="32" y1="42" x2="32" y2="58" stroke="#4da6ff" stroke-width="4" stroke-linecap="round" />
        <line x1="42" y1="42" x2="42" y2="55" stroke="#4da6ff" stroke-width="4" stroke-linecap="round" />
      </svg>
    `,
    'partly-cloudy': `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="20" r="10" fill="#ffcb47" />
        <ellipse cx="40" cy="34" rx="18" ry="12" fill="#c9d4e1" />
      </svg>
    `,
    windy: `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 26h24a6 6 0 1 1 0 12H18" fill="none" stroke="#7db9e8" stroke-width="4" stroke-linecap="round" />
        <path d="M10 38h18a6 6 0 0 0 0 12H14" fill="none" stroke="#7db9e8" stroke-width="4" stroke-linecap="round" />
      </svg>
    `,
    hot: `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="30" r="12" fill="#ff8a3d" />
        <path d="M24 10c2 8 0 12-4 18m20-18c-2 8 0 12 4 18" fill="none" stroke="#ff8a3d" stroke-width="4" stroke-linecap="round" />
      </svg>
    `,
    humid: `
      <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 10c-8 12-14 16-14 24a14 14 0 0 0 28 0c0-8-6-12-14-24z" fill="#7fd4ff" />
        <circle cx="32" cy="32" r="4" fill="#daf4ff" />
      </svg>
    `
  };
  return icons[iconName] || icons.cloudy;
}

function formatWeather(cityName, region, data) {
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return `
    <div class="weather-output">
      <div class="weather-icon">${getWeatherIconSvg(data.icon)}</div>
      <div class="weather-info">
        <h2>Weather Today</h2>
        <p><strong>${escapeHtml(cityName)}, ${escapeHtml(data.country)}</strong></p>
        <p>${escapeHtml(todayLabel)}</p>
        <p>🌡 Temperature: <strong>${escapeHtml(data.temp)}°C</strong></p>
        <p>☁ Condition: <strong>${escapeHtml(data.condition)}</strong></p>
        <p>💧 Humidity: <strong>${escapeHtml(data.humidity)}%</strong></p>
        <p>💨 Wind: <strong>${escapeHtml(data.wind)} m/s</strong></p>
        <p><strong>Region:</strong> ${escapeHtml(region)}</p>
      </div>
    </div>
  `;
}

function renderCityList() {
  const indiaCities = Object.keys(cityWeatherData.India).join(', ');
  const worldCities = Object.keys(cityWeatherData.World).join(', ');
  return `
    <div>
      <p><strong>Sample cities:</strong> ${escapeHtml(indiaCities)}${indiaCities && worldCities ? ', ' : ''}${escapeHtml(worldCities)}</p>
      <p>Tap a marker or type one of the city names above.</p>
    </div>
  `;
}

async function getweather() {
  const inputElement = document.getElementById('cityinput');
  const output = document.getElementById('weather-result');

  if (!inputElement || !output) {
    return;
  }

  const cityName = inputElement.value.trim();
  if (!cityName) {
    output.innerHTML = `<p>Please enter a city name.</p>${renderCityList()}`;
    return;
  }

  output.innerHTML = `<p>Loading weather for <strong>${escapeHtml(cityName)}</strong>...</p>`;

  let weatherData = null;
  let region = 'Live';

  if (OPEN_WEATHER_API_KEY) {
    try {
      weatherData = await fetchWeatherFromApi(cityName);
    } catch (error) {
      console.warn('API weather fetch failed:', error);
      weatherData = null;
    }
  }

  if (weatherData) {
    output.innerHTML = formatWeather(cityName, region, weatherData);
    return;
  }

  const normalized = cityName.toLowerCase().replace(/\s+/g, '');
  for (const currentRegion of Object.keys(cityWeatherData)) {
    for (const cityKey of Object.keys(cityWeatherData[currentRegion])) {
      const normalizedKey = cityKey.toLowerCase().replace(/\s+/g, '');
      if (normalizedKey === normalized) {
        output.innerHTML = formatWeather(cityKey, currentRegion, cityWeatherData[currentRegion][cityKey]);
        return;
      }
    }
  }

  const apiHint = !OPEN_WEATHER_API_KEY ? '<p>Set your OpenWeatherMap API key in <code>.env</code> to fetch live weather.</p>' : '';
  output.innerHTML = `
    <p>City not found: <strong>${escapeHtml(cityName)}</strong>.</p>
    <p>Try one of these sample cities below.</p>
    ${apiHint}
    ${renderCityList()}
  `;
}

async function fetchWeatherFromApi(cityName) {
  const url = `${OPEN_WEATHER_URL}?q=${encodeURIComponent(cityName)}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    country: data.sys?.country || '',
    temp: Math.round(data.main?.temp ?? 0),
    condition: data.weather?.[0]?.main ? `${data.weather[0].main}${data.weather[0].description ? ` (${data.weather[0].description})` : ''}` : 'Unknown',
    humidity: data.main?.humidity ?? 0,
    wind: data.wind?.speed ?? 0,
    icon: mapOpenWeatherIcon(data.weather?.[0]?.main ?? 'Cloudy')
  };
}

function mapOpenWeatherIcon(main) {
  const normalized = String(main).toLowerCase();
  if (normalized.includes('sun') || normalized.includes('clear')) return 'sunny';
  if (normalized.includes('cloud')) return 'cloudy';
  if (normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('shower')) return 'rainy';
  if (normalized.includes('thunder')) return 'rainy';
  if (normalized.includes('wind')) return 'windy';
  if (normalized.includes('hot') || normalized.includes('heat')) return 'hot';
  if (normalized.includes('humid')) return 'humid';
  return 'cloudy';
}

function selectCity(cityName) {
  const inputElement = document.getElementById('cityinput');
  if (!inputElement) {
    return;
  }

  inputElement.value = cityName;
  getweather();
}

window.getweather = getweather;
window.selectCity = selectCity;
