# WeatherApp - 查询天气

## 项目功能
本项目展示了一个使用 **AJAX** 技术从外部 **API** 获取天气数据的 Web 应用。用户可以输入城市名，查询该城市的天气，并进行增删改查操作。

### 主要功能：
- **查询天气**：输入城市名并查询该城市的天气信息。
- **删除城市天气**：可以删除已查询城市的天气记录。

## 技术栈
- HTML
- CSS
- JavaScript (AJAX)
- Node.js + Express
- MongoDB

## 使用方法
1. 下载并解压项目文件夹。
2. 在 `server.js` 文件中替换 `apiKey` 为你自己的 **OpenWeatherMap** API 密钥。
3. 启动 Node.js 后端：
   ```bash
   node backend/server.js