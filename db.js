const { MongoClient } = require("mongodb")

let dbConnection
let uri = 'mongodb+srv://nanopka84:nanopka84@cluster0.3tshose.mongodb.net/?retryWrites=true&w=majority'
let olduri = 'mongodb://0.0.0.0:27017/BookStore'

module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDB: () => dbConnection
}