const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase";
const client = new MongoClient(uri);

exports.connect = async () => {
    try {
        await client.connect();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

exports.close = async () => {
    await client.close();
};

exports.parta = async () => {
    try {
        let data = await client.db('sample_analytics').collection('customers').aggregate([
            {
                "$match": {"name": "Shirley Rodriguez"}
            }
        ]).toArray()
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

exports.partab = async () => {
    try {
        let data = await client.db('sample_analytics').collection('customers').aggregate([
            {
                "$match": {"name": "Shirley Rodriguez"}
            },
            {
                "$lookup": {
                    "from": "accounts",
                    "localField": "accounts",
                    "foreignField": "account_id",
                    "as": "accounts"
                }
            }
        ]).toArray()
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

exports.partabc = async () => {
    try {
        let data = await client.db('sample_analytics').collection('customers').aggregate([
            {
                "$match": {"name": "Shirley Rodriguez"}
            },
            {
                "$lookup": {
                    "from": "accounts",
                    "localField": "accounts",
                    "foreignField": "account_id",
                    "as": "accounts"
                }
            },
            {
                "$unwind": {
                    "path": "$accounts"
                }
            },
            {
                "$match": {
                    "accounts.products": "InvestmentFund"
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "accounts": {
                        "$push": "$accounts"
                    }
                }
            }
        ]).toArray()
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
}









