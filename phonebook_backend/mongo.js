const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://artemm3note:${password}@cluster0.brpjm4n.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(uri)

const entrieSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entrie = mongoose.model('Entrie', entrieSchema)

const entrie = new Entrie({
    name: 'test',
    number: '302-3-194'
})

entrie.save().then(result => {
    console.log('Entrie saved!')
    mongoose.connection.close()
})