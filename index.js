const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        app.post('/post', async (req, res) => {
            const posts = req.body;
            const result = await postCollections.insertOne(posts)
            res.send(result)
        })
        app.get('/post', async (req, res) => {
            const query = {}
            const result = await postCollections.find(query).toArray()
            res.send(result)
        })
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const details = await postCollections.findOne(query);
            res.send(details)
        })
        app.get('/toplike', async (req, res) => {
            const query = {}
            const cursor = postCollections.find(query).limit(3).sort({ counter: -1 })
            const result = await cursor.toArray()
            res.send(result)
        })
        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const unique = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updateDetails = {
                $set: {
                    title: user.title,
                    post: user.post,
                    image: user.image,
                    counter: user.counter,
                }
            }
            const result = await postCollections.updateOne(unique, updateDetails, option);
            res.send(result);
        })
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
        app.put('/userInfo/:id', async (req, res) => {
            const id = req.params.id;
            const unique = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updateUserInfo = {
                $set: {
                    name: user.name,
                    email: user.email,
                    university: user.university,
                    address: user.address

                }
            }
            const result = await UserInfoCollections.updateOne(unique, updateUserInfo, option);
            res.send(result);
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