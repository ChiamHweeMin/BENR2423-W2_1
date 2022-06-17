const bcrypt = require("bcryptjs")
let users;

class User {
	static async injectDB(conn) {
		users = await conn.db("Accounts").collection("users")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password
	 * @param {*} age  
	 * @param {*} phone 
	 */
	
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

	static async getlogin(username) {
		// TODO: Check if username exists
		const isExists = await users.findOne({Name: username})
		if (isExists) {
			return isExists
		}
		else {
			return "Invalid username!"
		}
	}

	static async update(username, age) {
		const isExists = await users.findOne({Name: username})
		if (isExists) {
			await users.updateOne({
            	Name: username
            }, { $set: { Age: age } }).then (result => {
                console.log(result)
            })
			return await users.findOne({Name: username})
		}
		else {
			return "The username is not exits!"
		}
	}

    static async delete(username) {
		// TODO: Check if username exists
		const isExists = await users.findOne({Name: username})
		if (isExists) {
			await users.deleteOne({Name: username}).then (result => {
                console.log(result.deletedCount)
            })
            return "The user is deleted!"
		}
		else {
			return "The username is not exits!"
		}
	}
}

module.exports = User;
