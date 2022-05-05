const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdu4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('warehouse-management').collection('products');
        app.get('/product', async (req, res)=>{
            const query = {}
        const cursor = productCollection.find(query);
        const products = await cursor.toArray();
        res.send(products)
        });

        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product)
        })

        app.post('/product', async(req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        // update product

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    name: updateProduct.name,
                    description: updateProduct.description,
                    seller: updateProduct.seller,
                    price: updateProduct.price,
                    img: updateProduct.img,
                    quantity: updateProduct.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // Delete API
        app.delete('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.dir);


// API for Check Server

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, ()=>{
    console.log('Lishing port', port);
})
