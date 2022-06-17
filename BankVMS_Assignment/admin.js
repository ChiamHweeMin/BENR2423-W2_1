const bcrypt = require("bcryptjs")

let admins;

class Admin {
	static async injectDB(conn) {
		admins = await conn.db("Bank_VMS").collection("Admin")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} password
	 * @param {*} name 
	 */
	
	 static async register(sample) {
		// Check if admin's name exists
        const isExists = await admins.findOne({ AdminName: sample.AdminName })
		if (isExists) {
			return { status: false }
		} else {
			// Hash the password
			const passwordHash = bcrypt.hashSync(sample.AdminPassword, 10);
			// Store the admin info into database	
			await admins.insertOne({
                AdminName: sample.AdminName,
				AdminPassword: passwordHash,
				AdminEmail: sample.AdminEmail,
				AdminContact: sample.AdminContact,
				role: "admin"
			}).then (result => {
				console.log(result)
			})
			return { status: true }
		}
	}

	static async login(name, password) {
		// Check if admin exists
		const isExists = await admins.findOne({ AdminName: name })
		if (isExists) {
			// Compare the password while login
			const verified = await bcrypt.compare(password, isExists.AdminPassword)
			if (verified) {
				return isExists
			}
			else {
				return { status: "Invalid password" }
			}
		}
		else {
			return { status: "Invalid admin name" }
		}
	}

	static async viewAllAdmin() {
		return await admins.find().sort({AdminName: 1}).toArray()
	}

	static async updateGeneralAdmin(sample) {
		// Check if admin exists
		const isExists = await admins.findOne({ AdminName: sample.AdminName })
		if (isExists) {
			// Update the fields except for AdminName and AdminPassword
			await admins.updateOne({
            	AdminName: sample.AdminName
            }, { 
				$set: {
					AdminEmail: sample.AdminEmail,
					AdminContact: sample.AdminContact
				} 
			}).then (result => {
                console.log(result)
            })
			return await admins.findOne({ AdminName: sample.AdminName })
		}
		else {
			return { status: false }
		}
	}

	static async updatePassAdmin(name, password) {
		// Find the query
		const isExists = await admins.findOne({ AdminName: name })
		if (isExists) {
			// Hash the new password
			const passwordHash = bcrypt.hashSync(password, 10);
			// Update the new password
			await admins.updateOne({
            	AdminName: name
            }, { 
				$set: {
					AdminPassword: passwordHash
				} }).then (result => {
                console.log(result)
            })
			return { status: true }
		}
		else {
			return { status: false }
		}
	}
	
	static async delete(name) {
		const isExists = await admins.findOne({ AdminName: name })
		if (isExists) {
			await admins.deleteOne({ AdminName: name }).then (result => {
                console.log(result.deletedCount)
            })
            return { status: "Deleted" }
		}
		return { status: "Not Found" }
	}
}

module.exports = Admin;
