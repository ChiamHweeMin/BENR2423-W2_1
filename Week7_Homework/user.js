const bcrypt = require("bcryptjs")
let users;

class User {
	static async injectDB(conn) {
		users = await conn.db("Accounts").collection("users")
	}

	static async register(username, password) {
		// TODO: Check if username exists
		const isExists = await users.findOne({Name: username})
		if (isExists) {
			console.log("The user already exits")
			return false
		} else {
		// TODO: Hash password
			const passwordHash = bcrypt.hashSync(password, 10);		
		// TODO: Save user to database
			await users.insertOne({
				Name: username,
				Password: passwordHash
			}).then (result => {
				console.log(result)
			})
	
			console.log("The user is saved.")
			return true
		}
	}

	static async login(username, password) {
		// TODO: Check if username exists
		const isExists = await users.findOne({Name: username})
		if (isExists) {
			const verified = await bcrypt.compare(password, isExists.Password)
			if (verified)
			{
				return isExists
			}
			else {
				return "Invalid password!"
			}
		}
		else {
			return "Invalid username!"
		}
	}
}

module.exports = User;


