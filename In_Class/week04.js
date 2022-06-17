const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.5gszr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(async err => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log('Connected to MongoDB');

// /* COMPARISON Operators */

    // client.db('sample_training').collection('trips').find({tripduration: {"$lte": 70}}).toArray().then(result => {
    //     console.log(result);
    // })

    // client.db('sample_training').collection('trips').find({
    //     "start time": {
    //         "$gte": new Date('2016-01-02T00:00:00.000Z'), 
    //         "$lt": new Date('2016-01-02T01:00:00.000Z')
    //     }
    // }).toArray().then(result => {
    //     console.log(result);
    // })

    // client.db('sample_training').collection('trips').find({
    //     "tripduration": { "$lte": 70 },
    //     "usertype": { "$ne": "Subscriber" }    
    // }).toArray().then(result => {
    //     console.log(result)
    // })

    // client.db('sample_training').collection('trips').find({
    //     "tripduration": { "$gt": 500 },
    //     "start station id": { "$eq": 530 }
    // }).toArray().then(result => {
    //     console.log(result)
    // })

    // let result = await client.db('sample_training').collection('trips').find({
    //     "tripduration": { "$in": [100, 150] }
    // }).toArray()

    // let result2 = await client.db('sample_training').collection('posts').find({
    //     "tags": "dryer" 
    // }, { "tags": 1 }).toArray()

// /* COMPARISON QUERY Operators - $elemMatch */

    // let result2 = await client.db('sample_training').collection('posts').find({
    //     "tags": { "$elemMatch": { "$eq" : "salt" } } 
    // }).toArray()

// /* LOGICAL QUERY Operators - $and, $or, $nor, $not */

    // let result2 = await client.db('sample_training').collection('posts').find({
    //     "$and": [
    //         { "tags": { "$elemMatch": { "$eq": "roof" } } },
    //         { "title": { "$not" : { "$eq": "Gettysburg Address" } } }
    //     ]
    // }).toArray()

    // let result2 = await client.db('sample_training').collection('posts').find({
    //     "author": { "$not": { "$eq":  "machine" } }
    // }).toArray()

    // let result2 = await client.db('sample_training').collection('posts').find({
    //     "date": { "$lt" : new Date ('2012-11-20T05:05:15.250Z') }
    // }).toArray()

    // let result2 = await client.db('sample_training').collection('posts').find({
    //     "title": "US Constitution", 
    //     "tags": { "$elemMatch": { "$eq": "balloon" } }
    // }).toArray()

// /* FIELD UPDATE Operators - $inc, $min, $max, $set, $unset */

    // let result2 = await client.db('Learning').collection('companies').updateOne(
    //     { _id:  ObjectId("6245dddc868b1e3816eb4bea") },
    //     { "$inc": { likes: 10 } }
    // )

    /*  $min, >= not update, update less than 
        $max, <= not update, update more than  */
    // let result2 = await client.db('Learning').collection('companies').updateOne(
    //     { _id:  ObjectId("6245dddc868b1e3816eb4bea") },
    //     { "$min": { likes: 10 } }
    // )

    // let result2 = await client.db('Learning').collection('companies').updateOne(
    //     { _id:  ObjectId("6245dddc868b1e3816eb4bea") },
    //     { "$unset": { likes: 0 } }
    // )

// /* ARRAY UPDATE Operators */

    // let result2 = await client.db('Learning').collection('companies').update(
    //     { name: "Google" },
    //     { "$addToSet": { comments: "hurray"}}
    // )

    let result2 = await client.db('Learning').collection('companies').update(
        { name: "Google" },
        { "$pop": { comments: 1}}  // 1, pop from back; -1, pop from front
    )


    console.log(result2)

})