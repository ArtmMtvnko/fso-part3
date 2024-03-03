const express = require('express')
const app = express()

app.use(express.json())

const persons = [
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
        response.status(404).end('Entrie not found')
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nLink: http://localhost:${PORT}`)
})