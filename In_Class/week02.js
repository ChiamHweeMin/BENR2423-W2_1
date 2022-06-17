const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.5gszr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log('Connected to MongoDB');

    client.db().admin().listDatabases().then(result => {        //listDatabases -a promise fucntion -asynchronous->then 
        //console.log(result['databases'][7]['name']);
        console.log(result);
    })

    // client.db('sample_training').listCollections().toArray().then(result => {
    //     console.log(result[1]);
    // })

    // client.db('sample_training').collection('companies').find({name: 'Cyworld'}).toArray().then(result => {
    //     console.log(result);
    // })

});
