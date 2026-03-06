// 全局变量 - 收藏列表
let collectionList = [];

// 初始化收藏功能
function initCollection() {
    // 从本地存储加载收藏数据
    loadCollectionFromLocalStorage();
    
    // 渲染收藏列表
    renderCollectionList();
    
    // 绑定弹窗关闭/取消/保存事件
    bindModalEvents();
}

// 从本地存储加载收藏数据
function loadCollectionFromLocalStorage() {
    const savedData = localStorage.getItem('6322WeatherCollection');
    if (savedData) {
        try {
            collectionList = JSON.parse(savedData);
        } catch (e) {
            console.error('加载收藏数据失败：', e);
            collectionList = [];
        }
    }
}

// 保存收藏数据到本地存储
function saveCollectionToLocalStorage() {
    localStorage.setItem('6322WeatherCollection', JSON.stringify(collectionList));
}

// 渲染收藏列表
function renderCollectionList() {
    const collectionListEl = document.getElementById('collectionList');
    const collectionCountEl = document.getElementById('collectionCount');
    
    // 更新收藏数量
    collectionCountEl.textContent = `${collectionList.length} 个城市`;
    
    // 清空列表
    collectionListEl.innerHTML = '';
    
    // 无数据时显示提示
    if (collectionList.length === 0) {
        collectionListEl.innerHTML = `
            <div class="empty-state" style="padding: 20px 0;">
                <i class="fas fa-star empty-icon" style="font-size: 32px;"></i>
                <p class="empty-text" style="font-size: 14px;">暂无收藏城市，快去添加吧～</p>
            </div>
        `;
        return;
    }
    
    // 渲染每个收藏项
    collectionList.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'collection-item';
        itemEl.innerHTML = `
            <div class="collection-city">${item.city} <span style="font-size: 14px; font-weight: normal;">${item.temp}℃</span></div>
            ${item.remark ? `<div class="collection-remark">备注：${item.remark}</div>` : ''}
            <div class="collection-weather">
                <span>${item.type}</span>
                <span>${item.wind}</span>
                <span>湿度${item.humidity}</span>
            </div>
            <div class="collection-actions">
                <button class="action-btn edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i> 编辑备注
                </button>
                <button class="action-btn delete-btn" data-index="${index}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        
        // 添加到列表
        collectionListEl.appendChild(itemEl);
        
        // 绑定编辑/删除事件
        itemEl.querySelector('.edit-btn').addEventListener('click', () => openRemarkModal(index));
        itemEl.querySelector('.delete-btn').addEventListener('click', () => deleteCollectionItem(index));
    });
}

// 添加城市到收藏
function addToCollection(weatherData) {
    // 检查是否已收藏
    const isExisted = collectionList.some(item => item.city === weatherData.city);
    if (isExisted) {
        alert(`${weatherData.city} 已在收藏列表中！`);
        return;
    }
    
    // 添加到收藏列表
    collectionList.push({
        city: weatherData.city,
        temp: weatherData.temp,
        type: weatherData.type,
        wind: weatherData.wind,
        humidity: weatherData.humidity,
        air: weatherData.air,
        remark: '' // 默认无备注
    });
    
    // 保存到本地存储并重新渲染
    saveCollectionToLocalStorage();
    renderCollectionList();
}

// 打开备注编辑弹窗
function openRemarkModal(index) {
    const modal = document.getElementById('remarkModal');
    const remarkInput = document.getElementById('remarkInput');
    
    // 设置当前编辑的索引
    modal.dataset.editIndex = index;
    
    // 填充现有备注
    remarkInput.value = collectionList[index].remark || '';
    
    // 显示弹窗
    modal.style.display = 'flex';
    
    // 聚焦输入框
    remarkInput.focus();
}

// 关闭备注编辑弹窗
function closeRemarkModal() {
    const modal = document.getElementById('remarkModal');
    modal.style.display = 'none';
    modal.dataset.editIndex = '';
    document.getElementById('remarkInput').value = '';
}

// 保存备注
function saveRemark() {
    const modal = document.getElementById('remarkModal');
    const index = modal.dataset.editIndex;
    const remark = document.getElementById('remarkInput').value.trim();
    
    if (index === '' || index === undefined) return;
    
    // 更新备注
    collectionList[index].remark = remark;
    
    // 保存并重新渲染
    saveCollectionToLocalStorage();
    renderCollectionList();
    
    // 关闭弹窗
    closeRemarkModal();
}

// 删除收藏项
function deleteCollectionItem(index) {
    if (!confirm(`确定要删除 ${collectionList[index].city} 的收藏吗？`)) return;
    
    // 删除项
    collectionList.splice(index, 1);
    
    // 保存并重新渲染
    saveCollectionToLocalStorage();
    renderCollectionList();
}

// 绑定弹窗相关事件
function bindModalEvents() {
    // 关闭弹窗按钮
    document.getElementById('closeModal').addEventListener('click', closeRemarkModal);
    document.getElementById('cancelRemark').addEventListener('click', closeRemarkModal);
    
    // 保存备注按钮
    document.getElementById('saveRemark').addEventListener('click', saveRemark);
    
    // 点击弹窗外部关闭
    const modal = document.getElementById('remarkModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRemarkModal();
    });
}

// 暴露添加收藏方法到全局
window.addToCollection = addToCollection;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initCollection);