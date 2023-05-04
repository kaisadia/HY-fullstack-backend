require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const port = process.env.PORT 
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body'));


const get = app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => { 
  res.json(people)}
)})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for 
    ${get.length} people 
    ${new Date().toString()}`)
    })

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
    res.json(person)}
    else {res.status(404).end()}
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })

})
      
    
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  } else if (body.number === undefined) {
    return res.status(400).json({ error: 'number missing' })}

  const person = new Person({
    name: body.name,
    number: body.number 
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
  return res.status(400).json({ error: error.message })
}
next(error)
}

app.use(errorHandler)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })