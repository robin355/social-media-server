const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.1qyvldj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const postCollections = client.db('social').collection('posts')
        const UserInfoCollections = client.db('social').collection('about')
        app.post('/userInfo', async (req, res) => {
            const info = req.body
            const result = await UserInfoCollections.insertOne(info)
            res.send(result)
        })
        app.get('/userInfo', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const userInfo = await UserInfoCollections.findOne(query)
            res.send(userInfo)
        })

    }
    finally {

    }

}
run().catch(err => console.log(err))









app.get('/', (req, res) => {
    res.send('Social Media')
})

app.listen(port, () => {
    console.log(`Social Media Running ${port}`)
})