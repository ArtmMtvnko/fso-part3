const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://artemm3note:${password}@cluster0.brpjm4n.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({ important: false }).then(result => {
    console.log(result)
    mongoose.connection.close()
})
// Note.find({}).then(....) for getting all notes

// const note = new Note({
//     content: 'HTML is easy (test note)',
//     important: false
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })