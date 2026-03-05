const express = require('express');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const apiKey = 'your_api_key';  // 请替换为你自己的API密钥
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';

// 连接MongoDB数据库
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const db = client.db('weatherapp');
        const citiesCollection = db.collection('cities');

        // 查询天气数据并存入数据库
        app.get('/api/weather/:city', async (req, res) => {
            const city = req.params.city;
            const url = `${apiUrl}${city}&appid=${apiKey}&units=metric&lang=zh_cn`;

            try {
                const response = await axios.get(url);
                const cityData = response.data;

                // 将数据保存到数据库
                await citiesCollection.updateOne(
                    { name: cityData.name },
                    { $set: cityData },
                    { upsert: true }
                );

                res.json(cityData);
            } catch (error) {
                res.status(500).send('获取天气数据失败');
            }
        });

        // 删除城市数据
        app.delete('/api/delete/:city', async (req, res) => {
            const city = req.params.city;
            await citiesCollection.deleteOne({ name: city });
            res.json({ message: '删除成功' });
        });

        // 启动服务器
        app.listen(port, () => {
            console.log(`服务器正在监听 http://localhost:${port}`);
        });
    })
    .catch(error => console.error('数据库连接失败:', error));