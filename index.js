const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Mongodb = require('./config/mongodb')
const { ObjectId } = require('mongodb')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())



const mongodb = new Mongodb()
const getCarterias = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").find({}).toArray()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(401).json({status: 'error', message: 'Erro: ' + error}))
}

const addCarteria = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").insertOne(request.body)
        .then(result => response.status(201).json({ status: 'success', message: 'Carteria criada.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const updateCarteria = async (request, response, next) => {
    const { _id, nome } = request.body
    const db = await mongodb.getDB()
    db.collection("Carteiras").updateOne({_id: new ObjectId(_id)}, {$set: {nome}})
        .then(result => response.status(201).json({ status: 'success', message: 'Carteria atualizada.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const deleteCarteria = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").deleteOne({_id: new ObjectId(request.params.id)})
        .then(result => response.status(201).json({ status: 'success', message: 'Carteria removida.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const getCarteriaPorID = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").findOne({_id: new ObjectId(request.params.id)})
        .then(result => response.status(201).json(result))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

app
    .route('/carteria')
    // GET endpoint
    .get(getCarterias)
    // POST endpoint
    .post(addCarteria)
    // PUT
    .put(updateCarteria)  

app.route('/carteria/:id')
    .get(getCarteriaPorID) 
    .delete(deleteCarteria) 


// Start server
app.listen(process.env.PORT || 3003, () => {
    console.log(`Servidor rodando nas porta 3003`)
})