require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => response.send('<h1>Phonebook Backend!</h1>'))

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const personsCount = persons.length
        const currentDate = new Date()

        const result =
        `
        <p>Phonebook has info for ${personsCount} people</p>
        <p>${currentDate}</p>
        `

        response.send(result)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => {
            response.status(404).json({
                error: 'Person not found'
            })
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => response.status(204).end())
        .then(error => next(error))

    // Alternative way:
    // Person.deleteOne({ _id: request.params.id })
    //     .then(result => response.json(result))
    //     .catch(error => response.status(404).end())
})

// const isNameUnique = (name) => {
//     const person = persons.find(person => person.name === name)

//     return persons.find(person => person.name === name)
//         ? false
//         : true
// }

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(result => response.json(result))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) =>
    response.status(404).send({ error: 'unknown endpoint' })

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nLink: http://localhost:${PORT}`)
})