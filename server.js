const express = require('express')
const app = express()
const bodyparser = require('body-parser')

const ObjectId = require('mongodb').ObjectID

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://teste:1q2w3e4r@cluster0.rw1ju.mongodb.net/crud?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('test') // coloque o nome do seu DB

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
})

app.use(bodyparser.urlencoded({ extended: true}))

app.set('view engine', 'ejs')

app.get('/', function(req, res){
    res.render('home');
});

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show', { data: results })

    })
})

app.post('/show', (req, res)=>{
    //criar a coleção “data”, que irá armazenar nossos dados
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)
    
        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
      })
});

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var email = req.body.email
  var senha = req.body.senha
  var endereco = req.body.endereco
  var cidade = req.body.cidade
  var estado = req.body.estado
  var cep = req.body.cep
  var check = req.body.check
  
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      email: email,
      senha: senha,
      endereco: endereco,
      cidade: cidade,
      estado: estado,
      cep: cep,
      check: check,
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})


