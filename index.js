const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
let db = require('./db.json')
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/api/persons', (req, res) => {
res.json(db)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${db.persons.length} people 
    ${new Date().toString()}`)
    })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(db.persons)
    const person = db.persons.find(person => person.id === id)
    if(!person) {
        res.status(404).end()
    } else {
    res.json(person)}
    })
    
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
     db = db.persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
   const maxId = db.persons.length > 0 ? Math.max(...db.persons.map(n => n.id)) : 0
   const person = req.body;
   person.id = maxId +1

   if (!person.name || !person.number) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  } else if(db.persons.map(name => name.name).includes(person.name)){
    return res.status(400).json({ 
      error: 'name already exists' 
    })
  } else { 
   db.persons =db.persons.concat(person)
   console.log(person);
   res.json(person)
}})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })