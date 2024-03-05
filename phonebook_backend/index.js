const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => response.send('<h1>Phonebook Backend!</h1>'))

app.get('/info', (request, response) => {
    const personsCount = persons.length
    const currentDate = new Date()
    
    const result = 
    `
    <p>Phonebook has info for ${personsCount} people</p>
    <p>${currentDate}</p>
    `

    response.send(result)
})

app.get('/api/persons', (request, response) => response.json(persons))

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const entrie = persons.find(person => person.id === id)

    if (entrie) {
        response.json(entrie)
    } else {
        response.status(404).json({
            error: 'Entrie not found'
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 1000000000000000)

const isNameUnique = (name) => {
    const person = persons.find(person => person.name === name)
    
    return persons.find(person => person.name === name)
        ? false
        : true
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (!isNameUnique(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const entrie = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(entrie)

    response.json(entrie)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nLink: http://localhost:${PORT}`)
})