
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv/config') //Shorthand to get your dotenv and configure it so your env comes up on 
// process.env console log

// -- Variables
const app = express()
const port = 3002

console.log(process.env)
// -- Models
// * Define a "Schema" for our contacts
// A Schema defines the fields for our data entity. In this case, our data entity is a contact.
// We want two fields for each contact; "name" & "email"
const consoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, //These can be done as a key value pair only but as an object
    manufacturer: { type: String, require: true}, //We can add more info like if they are required
    releaseYear: { type: Number, require: true}
})

// * Define the "Model" that will create a collection in our database.
// A schema alone won't achieve anything, it needs to be assigned to a model.
// A mongoose model corresponds to a collection within a MongoDB database. Examples of models/collections might be "movies" and "users".
// In this example, the model will be for "Contacts" and will contain an array of single contact documents
// The Schema defines which fields those documents should have.

const Console = mongoose.model('Console', consoleSchema)

// -- Middleware
// Convert JSON data in the request body into JS, saving it on `req.body`
app.use(express.json())

// Use Morgan to log each request received to the console
app.use(morgan('dev'))


// -- Route Handlers
// Index-Route
app.get('/consoles', async (req, res) => {
    try{
        const consoles = await Console.find()
        return res.send(consoles)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
})

// Create-Route
app.post('/consoles', async (req, res) => {
    try {
       const console = await Console.create(req.body)
    return res.status(201).send(console)
    } catch(error) {
        return res.status(500).send('Something went wrong')
    }
})

// Show-Route
app.get('/consoles/:consoleId', async (req, res) => { 
    try {
        const foundDocument = await Console.findById(req.params.consoleId)
        if(!foundDocument) return res.status(404).send('No record found for this console')
            return res.send(foundDocument) //check the syntax of this why isn't it an if/else?
    } catch(error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
})                                         


// Update-Route
// The "update" route should update a single specific consoles ID
// Route: PUT /console/:consoleId
// Body: JSON ojbect containing "name" and/or "manufacturer"
app.put('/consoles/:consoleId', async (req, res) => {
   try{
    const updatedConsole = await Console.findByIdAndUpdate(req.params.consoleId, req.body, { returnDocument: 'after' })
    return res.send(updatedConsole)
   } catch(error) {
    console.log(error.message)
    return res.status(500).send('Something went wrong')

   }
})

// Delete-Route
// Should delete a single specific contacts object
// Route: DELETE /consoles/:consoleId
// Body: Not required
app.delete('/consoles/:consoleId', async (req, res) => { 
    try {
        await Console.findByIdAndDelete(req.params.consoleId)
        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
}) 


// 404 Handler
app.get('*', (req, res) => {
    return res.status(404).send('<h1>Page not found!</h1>')
})

//Server Connection
const startServers = async () => {
    try{
        // Establish DB connection
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connection established')
        //Start the express server
        app.listen(port, () => {
            console.log(`Server launched on port ${port}`)})
    } catch (error) {

    }
}
startServers()