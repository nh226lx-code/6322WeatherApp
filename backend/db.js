const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToDB() {
    await client.connect();
    const db = client.db('weatherapp');
    return db;
}

module.exports = connectToDB;