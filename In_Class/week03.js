const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.5gszr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(async err => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log('Connected to MongoDB');

    // await client.db('myFirstDatabase').collection('customers').updateOne({
    //     //_id:ObjectId("623ac0c39b5cd18538291463")
    //     name:'Jon'
    // }, {
    //     $set:{
    //         name:"Peter",
    //         age:35
    //     }
    // }), { upsert: true }.then (res => {
    //     console.log(res)
    // })

    // await client.db('myFirstDatabase').collection('customers').updateOne({
    //     name:'Jon'
    // }, {
    //     $set:{
    //         name:"Jon Doe",
    //         age:35
    //     }
    // }, { upsert: true }).then (res => {         //upsert function- if the name we search for update doesn't exist, auto insert new with unique _id
    //     console.log(res)
    // })

    // client.db('myFirstDatabase').collection('customers').deleteOne({
    //     name: 'Jon Doe'
    // }).then(result => {
    //     console.log(result.deletedCount);
    // })

    // client.db('myFirstDatabase').collection('customers').deleteMany({
    //     name:'Ali',
    //     age:40
    // }).then(result => {
    //     console.log(result.deletedCount)
    // })

    // client.db('myFirstDatabase').collection('customers').insertOne({        //promise - asynchronous operation, need time to get the result back
    //     name:'John',                                                        //        - will not get response immediately whether it is success or failed
    //     age:30,
    //     location:'New York',
    //     isActive: true,
    //     tags:['tags1','tags2'],
    // }).then(result => {                                                     //use then to wait the operation complete and show the result
    //     console.log(result);
        
    //     client.db('myFirstDatabase').collection('customers').insertOne({        //promise - asynchronous operation, need time to get the result back
    //         name:'Johns Friend',      
    //         friend:result.insertedId,                                                  //        - will not get response immediately whether it is success or failed
    //         age:30,
    //         location:'New York',
    //         isActive: true,
    //         tags:['tags1','tags2'],
    //     }).then(result => {                                                     //use then to wait the operation complete and show the result
    //         console.log(result);
    //     });
    // });

    //use keyword -await- to replace .then (wait for the function to complete before proceed to next code)
    //console.time('insert');
    // let result1 = await client.db('myFirstDatabase').collection('customers').insertOne({
    //     name: 'Ali',
    //     age:30,
    //     location:'New York',
    //     isActive:true,
    //     tags:['tags1','tags2'],
    // })

    // let result1 = await client.db('myFirstDatabase').collection('customers').insertMany([
    //     {
    //         name: 'Ali',
    //         age:30,
    //         location:'New York',
    //         isActive:true,
    //         tags:['tags1','tags2'],
    //     },
    //     {
    //         name:'Jon',                                                        //        - will not get response immediately whether it is success or failed
    //         age:40,
    //         location:'Melaka',
    //         isActive: true,
    //         tags:['tags1','tags2'],
    //     }
    // ])
    // console.timeEnd('insert')       //asynchronous process- take time to complete operation

    // let result2 = await client.db('myFirstDatabase').collection('customers').insertOne({
    //     name: 'Alis friend',
    //     friend:result1.insertedId,
    //     age:30,
    //     location:'New York',
    //     isActive:true,
    //     tags:['tags1','tags2'],
    // })

    // let result = await client.db('Learning').collection('companies').insertMany([
    //     {
    //         name: "Google"
    //     },
    //     {
    //         name: "UTeM"
    //     },
    //     {
    //         name: "Facebook"
    //     }
    // ])

    // console.log(result)

    let result = await client.db('Learning').collection('companies').update(
        { name: "Google" },
        { "$set": { comments: [
            "good",
            "great",
            "awesome"
        ]}}
    )

    console.log(result)

    // console.log('Inserted 1 document', result1);

});
