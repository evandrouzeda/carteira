const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Mongodb = require('./config/mongodb')
const { ObjectId } = require('mongodb')
require('dotenv').config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())



const mongodb = new Mongodb()
const getCarteiras = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").find({}).toArray()
        .then(result => response.status(200).json(result))
        .catch(error => response.status(401).json({status: 'error', message: 'Erro: ' + error}))
}

const addCarteira = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").insertOne(request.body)
        .then(result => response.status(201).json({ status: 'success', result }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const updateCarteira = async (request, response, next) => {
    const { _id, nome } = request.body
    const db = await mongodb.getDB()
    db.collection("Carteiras").updateOne({_id: new ObjectId(_id)}, {$set: {nome}})
        .then(result => response.status(201).json({ status: 'success', message: 'Carteira atualizada.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const deleteCarteira = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").deleteOne({_id: new ObjectId(request.params.id)})
        .then(result => response.status(201).json({ status: 'success', message: 'Carteira removida.' }))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

const getCarteiraPorID = async (request, response, next) => {
    const db = await mongodb.getDB()
    db.collection("Carteiras").findOne({_id: new ObjectId(request.params.id)})
        .then(result => response.status(201).json(result))
        .catch(error => response.status(401).json({ status: 'error', message: 'Erro: ' + error }))
}

app
    .route('/carteira')
    // GET endpoint
    .get(getCarteiras)
    // POST endpoint
    .post(addCarteira)
    // PUT
    .put(updateCarteira)  

app.route('/carteira/:id')
    .get(getCarteiraPorID) 
    .delete(deleteCarteira) 


// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor rodando nas porta 5000`)
})