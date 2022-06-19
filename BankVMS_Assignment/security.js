const bcrypt = require("bcryptjs")

let secure;

class Security {
	static async injectDB(conn) {
		secure = await conn.db("Bank_VMS").collection("Security")
	}
	
	static async register(sample) {
		// Check if security's name exists
        	const isExists = await secure.findOne({ SecurityName: sample.SecurityName })
		if (isExists) {
			return { status: false }
		} else {
			// Hash the password
			const passwordHash = bcrypt.hashSync(sample.SecurityPassword, 10);
			// Store the admin info into database	
			await secure.insertOne({
                		SecurityName: sample.SecurityName,
				SecurityPassword: passwordHash,
				SecurityEmail: sample.SecurityEmail,
				SecurityContact: sample.SecurityContact,
				role: "security"
			}).then (result => {
				console.log(result)
			})
			return { status: true }
		}
	}

	static async login(name, password) {
		// Check if security name exists
		const isExists = await secure.findOne({ SecurityName: name })
		if (isExists) {
			// Compare the password while login
			const verified = await bcrypt.compare(password, isExists.SecurityPassword)
			if (verified) {
				return isExists
			}
			else {
				return { status: "Invalid password" }
			}
		}
		else {
			return { status: "Invalid security name" }
		}
	}

	static async updateGeneralSecurity(sample) {
		// Check if security exists
		const isExists = await secure.findOne({ SecurityName: sample.SecurityName })
		if (isExists) {
			// Update the fields except for SecurityName and SecurityPassword
			await secure.updateOne({
            			SecurityName: sample.SecurityName
           	 }, { 
				$set: {
					SecurityEmail: sample.SecurityEmail,
					SecurityContact: sample.SecurityContact
				} 
			}).then (result => {
                		console.log(result)
		    	})
			return await secure.findOne({ SecurityName: sample.SecurityName })
		}
		else {
			return { status: false }
		}
	}

	static async updatePassSecurity(name, password) {
		// Find the query
		const isExists = await secure.findOne({ SecurityName: name })
		if (isExists) {
			// Hash the new password
			const passwordHash = bcrypt.hashSync(password, 10);
			// Update the new password
			await secure.updateOne({
            			SecurityName: name
           		 }, { 
				$set: {
					SecurityPassword: passwordHash
				} }).then (result => {
                			console.log(result)
            			})
			return { status: true }
		}
		else {
			return { status: false }
		}
	}
}

module.exports = Security;


