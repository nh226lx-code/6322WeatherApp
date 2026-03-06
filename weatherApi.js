let currentWeatherData = null;

// 初始化天气查询功能
function initWeatherApi() {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');

    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => getWeatherByCity(cityInput.value));

    // 回车查询
    cityInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') getWeatherByCity(cityInput.value);
    });

    // 收藏按钮点击事件
    document.getElementById('collectBtn')
        .addEventListener('click', collectCurrentCity);
}

// 根据城市获取天气数据
function getWeatherByCity(city) {
    if (!city || city.trim() === '') {
        showMessage('请输入有效的城市名！');
        return;
    }

    const loading = document.getElementById('loading');
    const weatherResult = document.getElementById('weatherResult');
    const emptyState = document.getElementById('emptyState');

    loading.style.display = 'flex';
    weatherResult.style.display = 'none';
    emptyState.style.display = 'none';

    const apiKey = "463d85988ab540af9b3184000260603";  
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city.trim())}&lang=zh`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("查询失败，请稍后再试。");
            }
            return response.json();
        })
        .then(data => {
            if (!data.current) throw new Error("未找到该城市的天气信息");

            currentWeatherData = {
                city: data.location.name,
                temp: data.current.temp_c,
                type: data.current.condition.text,
                wind: data.current.wind_dir + " " + data.current.wind_kph + "km/h",
                humidity: data.current.humidity + "%",
                air: data.current.air_quality ? ("AQI " + Math.round(data.current.air_quality["us-epa-index"])) : "无"
            };

            renderWeatherData(currentWeatherData);
            weatherResult.style.display = 'block';
        })
        .catch(error => {
            showMessage("查询失败：" + error.message);
            emptyState.style.display = 'block';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

// 渲染天气数据到页面
function renderWeatherData(weatherData) {
    document.getElementById('resultCity').textContent = weatherData.city;
    document.getElementById('tempValue').textContent = weatherData.temp;
    document.getElementById('weatherType').textContent = weatherData.type;
    document.getElementById('windDir').textContent = weatherData.wind;
    document.getElementById('humidity').textContent = "湿度：" + weatherData.humidity;
    document.getElementById('airQuality').textContent = "空气质量：" + weatherData.air;
}

// 收藏当前城市的天气数据
function collectCurrentCity() {
    if (!currentWeatherData) {
        showMessage('请先查询天气再收藏！');
        return;
    }
    if (window.addToCollection) {
        window.addToCollection(currentWeatherData);
        showMessage(`成功收藏 ${currentWeatherData.city}`);
    }
}

// 自定义提示框（替代浏览器默认的 alert）
function showMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box');
    messageBox.textContent = message;

    // 显示提示框
    document.body.appendChild(messageBox);
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initWeatherApi);