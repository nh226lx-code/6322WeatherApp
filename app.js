// 收藏列表数据
let favList = JSON.parse(localStorage.getItem('weatherFav')) || [];

// 获取页面元素
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const collectionCount = document.getElementById('collectionCount');
const collectionList = document.getElementById('collectionList');

// 页面加载初始化
window.onload = function() {
    searchBtn.onclick = searchWeather;
    cityInput.onkeydown = function(e) {
        if (e.keyCode === 13) {
            searchWeather();
        }
    };
    renderFavList();
};

// 查询天气
function searchWeather() {
    const cityName = cityInput.value.trim();
    if (cityName === '') {
        alert('请输入要查询的城市名称');
        return;
    }

    weatherCard.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>查询中...</p></div>';

    setTimeout(function() {
        const temp = Math.floor(Math.random() * 20) + 8;
        const weatherTypes = ['晴', '多云', '阴', '小雨'];
        const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const windTypes = ['东风 2级', '南风 3级', '北风 2级'];
        const wind = windTypes[Math.floor(Math.random() * windTypes.length)];
        const humidity = Math.floor(Math.random() * 40) + 40 + '%';
        
        const today = new Date();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        const dateStr = today.getFullYear() + '-' + month + '-' + day;

        let weatherIcon = 'fas fa-cloud';
        if (weatherType === '晴') {
            weatherIcon = 'fas fa-sun';
        } else if (weatherType === '多云') {
            weatherIcon = 'fas fa-cloud-sun';
        } else if (weatherType === '小雨') {
            weatherIcon = 'fas fa-cloud-rain';
        }

        // 收藏按钮：图标+文本（保留文本但无提示）
        weatherCard.innerHTML = `
        <div class="weather-info">
            <div class="weather-top">
                <div class="city-and-temp">
                    <div class="city-name">
                        <i class="fas fa-map-marker-alt"></i>${cityName}
                    </div>
                    <div class="temp">${temp}℃</div>
                </div>
                <button class="collect-button" id="collectBtn" title="收藏该城市">
                    <i class="fas fa-bookmark"></i>
                    <span>收藏城市</span>
                </button>
            </div>
            <div class="weather-grid">
                <div class="weather-item">
                    <i class="${weatherIcon} weather-item-icon"></i>
                    <div class="label">天气</div>
                    <div class="value">${weatherType}</div>
                </div>
                <div class="weather-item">
                    <i class="fas fa-wind weather-item-icon"></i>
                    <div class="label">风向</div>
                    <div class="value">${wind}</div>
                </div>
                <div class="weather-item">
                    <i class="fas fa-tint weather-item-icon"></i>
                    <div class="label">湿度</div>
                    <div class="value">${humidity}</div>
                </div>
                <div class="weather-item">
                    <i class="fas fa-calendar-day weather-item-icon"></i>
                    <div class="label">更新</div>
                    <div class="value">${dateStr}</div>
                </div>
            </div>
        </div>`;

        document.getElementById('collectBtn').onclick = function() {
            collectCity(cityName, temp, weatherType, wind);
        };
    }, 500);
}

// 收藏城市
function collectCity(city, temp, weather, wind) {
    for (let i = 0; i < favList.length; i++) {
        if (favList[i].city === city) {
            alert('该城市已收藏');
            return;
        }
    }
    favList.push({
        city: city,
        temp: temp + '',
        weather: weather,
        wind: wind,
        note: ''
    });
    localStorage.setItem('weatherFav', JSON.stringify(favList));
    renderFavList();
    alert('收藏成功');
}

// 渲染收藏列表
function renderFavList() {
    collectionCount.innerText = favList.length;

    if (favList.length === 0) {
        collectionList.innerHTML = `
        <div class="empty-fav">
            <i class="fas fa-star"></i>
            <p>暂无收藏</p>
        </div>`;
        return;
    }

    let html = '';
    for (let i = 0; i < favList.length; i++) {
        const item = favList[i];
        let note = '';
        if (item.note !== '') {
            note = `<div style="font-size:12px;color:#2563eb;margin-top:4px">${item.note}</div>`;
        }
        // 编辑/删除按钮：仅图标，无文本
        html += `
        <div class="fav-item" data-index="${i}">
            <div>
                <div class="fav-city">${item.city}</div>
                <div class="fav-info">${item.weather} ${item.temp}℃ | ${item.wind}</div>
                ${note}
            </div>
            <div class="fav-btns">
                <button class="edit" title="编辑备注"><i class="fas fa-edit"></i></button>
                <button class="del" title="删除收藏"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }
    collectionList.innerHTML = html;

    // 绑定事件
    const items = document.querySelectorAll('.fav-item');
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const index = item.getAttribute('data-index');
        item.querySelector('.edit').onclick = function() {
            editFav(index);
        };
        item.querySelector('.del').onclick = function() {
            delFav(index);
        };
    }
}

// 编辑备注
function editFav(index) {
    const oldNote = favList[index].note;
    const newNote = prompt('请输入备注（例如：家乡、公司）', oldNote);
    if (newNote === null) return;
    favList[index].note = newNote.trim();
    localStorage.setItem('weatherFav', JSON.stringify(favList));
    renderFavList();
}

// 删除收藏
function delFav(index) {
    if (confirm('确定删除该收藏吗？')) {
        favList.splice(index, 1);
        localStorage.setItem('weatherFav', JSON.stringify(favList));
        renderFavList();
    }
}