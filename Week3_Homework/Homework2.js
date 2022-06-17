const userNew = require("./user");
const bcrypt = require("bcryptjs")

const saltRounds = 10

bcrypt.genSalt(saltRounds, function (saltError, salt) {
  if (saltError) {
    throw saltError
  } else {
    bcrypt.hash(userNew.password, salt, function(hashError, hash) {
      if (hashError) {
        throw hashError
      } else {
        userNew.password = hash
        //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
      }
    })
  }
})

const { MongoClient, ServerApiVersion, Admin } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.5gszr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    if (err) {
        console.log(err.message)
        return
    }
    
    console.log('Connected to MongoDB');

    client.db('Accounts').collection('userFake').insertOne({
        name: userNew.name,
        // name_zh_CN: userNew.zh_CN_fullName,
        avatar_URL: userNew.avatar_URL,
        address: userNew.address,
        password: userNew.password
    }).then(result => {
        console.log(result)
    })

});
