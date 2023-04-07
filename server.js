const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'genny-data'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('rappers').find().toArray()
        response.render('index.ejs')
})
app.get('/find',(request, response)=>{
    db.collection('characters').findOne({name: request.query.name.toLowerCase()})
    .then(data => {
         console.log(data)
         response.render('personel.ejs', {info: data})
    })
    .catch(error => console.error(error))
})

app.post('/addCharacter', (request, response) => {
    db.collection('characters').insertOne({
        name: request.body.name,
        age: request.body.age, 
        dob: request.body.dateOfBirth, 
        height: request.body.height,
        title: request.body.title,
        quote: request.body.quote
    })
    .then(result => {
        console.log(`Character ${request.body.name} Added`)
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });
// did it work this time
