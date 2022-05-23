const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

const express = require('express')
const app = express()
// const port = 3000
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'],
}
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * @swagger
 * /login:
 *   post:
 *     description: User login
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Login failed
 */
 app.get('/', (req, res) => {
	res.send('Hello World!');
  });

app.get('/login/:username', async (req, res) => {
	console.log(req.body);
	const user = await User.getlogin(req.params.username);
	if (user == "Invalid username!") {
		return res.status(404).send("User is not exits!")
	} 
	return res.status(200).json(user)	
})

app.post('/login', async (req, res) => {
	console.log(req.body);

	const user = await User.login(req.body.username, req.body.password);
	console.log("Name: ", user.Name)
	console.log("Password: ", user.Password)

	if (user == "Invalid password!" || user == "Invalid username!" )
	{
		return res.status(404).send("Login failed")
	}
	return res.status(200).json(user)
})

app.post('/register', async (req, res) => {
	console.log(req.body);
	const user = await User.register(req.body.username, req.body.password);
	if (user == false) {
		return res.status(404).send("User already exits!")
	} 
	return res.status(200).send("The user is saved.")	
})

app.patch('/update/:username', async (req, res) => {
	console.log(req.body);
    const user = await User.update(req.body.username, req.body.age);
	console.log(user)
    if (user == "The username is not exits!") {
        return res.status(404).send("The user information is not updated.")
    }
    return res.status(200).json(user)
})

app.delete('/delete/:username', async (req, res) => {
    const user = await User.delete(req.params.username);
	if (user == "The user is deleted!") {
		return res.status(200).send("Deleted!")
	}
	else {
		return res.status(404).send("Failed to delete!")
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})


