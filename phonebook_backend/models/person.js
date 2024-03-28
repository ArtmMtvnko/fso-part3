const mongoose = require('mongoose')

const password = process.argv[2]

const uri = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(uri)
    .then(result => console.log('connecting to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB', error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (v) => {
                return /\d{2,3}-\d+/.test(v)
            }
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person 