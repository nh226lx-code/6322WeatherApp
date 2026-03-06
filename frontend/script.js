document.addEventListener('DOMContentLoaded', function () {
    const weatherInfoDiv = document.getElementById('weather-info');
    const cityInput = document.getElementById('city-name');
    const addCityButton = document.getElementById('add-city');

    // 获取天气数据
    function fetchWeatherData(city) {
        fetch(`/api/weather/${city}`)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => alert('获取数据失败！'));
    }

    // 显示天气数据
    function displayWeather(data) {
        const weatherHtml = `
            <div class="weather-card" id="weather-card-${data.name}">
                <h3>${data.name}</h3>
                <p>天气：${data.weather[0].description}</p>
                <p>温度：${data.main.temp}°C</p>
                <p>湿度：${data.main.humidity}%</p>
                <button onclick="deleteCity('${data.name}')">删除</button>
                <button onclick="editCity('${data.name}')">编辑</button>
            </div>
        `;
        weatherInfoDiv.innerHTML += weatherHtml;
    }

    // 查询城市天气
    addCityButton.addEventListener('click', function () {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
            cityInput.value = ''; // 清空输入框
        }
    });

    // 删除城市天气数据
    window.deleteCity = function (cityName) {
        fetch(`/api/delete/${cityName}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(() => {
                const card = document.getElementById(`weather-card-${cityName}`);
                card.remove();
            })
            .catch(error => alert('删除失败！'));
    };

    // 编辑城市数据
    window.editCity = function (cityName) {
        const newCity = prompt('请输入新的城市名：', cityName);
        if (newCity && newCity !== cityName) {
            fetchWeatherData(newCity);
        }
    };
});