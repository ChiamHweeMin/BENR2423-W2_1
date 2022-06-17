const bcrypt = require("bcryptjs")
let visitors;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("Bank_VMS").collection("Visitor")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} vname 
	 * @param {*} vid
	 */

	static async register(sample) {
		// Check if visitor ID exists
        const isExists = await visitors.findOne({V_ID: sample.V_ID})
		if (isExists) {
			console.log("The visitor already exits")
			return { status: false }
		} else {
			// Hash the password
			const passwordHash = bcrypt.hashSync(sample.V_password, 10);
			// Store the visitor info into database	
			await visitors.insertOne({
                V_ID: sample.V_ID,
				V_name: sample.V_name,
				V_age: sample.V_age,
				V_gender: sample.V_gender,
                V_ICnum: sample.V_ICnum,
                V_email: sample.V_email,
				V_contact: sample.V_contact,
                V_blacklist: sample.V_blacklist,
				V_password: passwordHash,
				role: 'visitor'
			}).then (result => {
				console.log(result)
			})
			console.log("The visitor is saved.")
			return await visitors.findOne({V_ID: sample.V_ID})
		}
	}

	static async login(vid, password) {
		// Check if visitor ID exists
		const isExists = await visitors.findOne({ V_ID: vid })
		if (isExists) {
			// Compare the password while login
			const verified = await bcrypt.compare(password, isExists.V_password)
			if (verified) {
				return isExists
			}
			else {
				return { status: "Invalid password" }
			}
		}
		else {
			return { status: "Invalid visitor ID" }
		}
	}

	static async getVisitor(vid, vname) {
		// Find the visitor with the specfied ID and Name
		const isExists = await visitors.findOne({ V_ID: vid, V_name: vname })
		if (isExists) {
			return isExists
		}
		else {
			return { status: "Error Not Found" }
		}
	}

	static async viewAllVisitor() {
		return await visitors.find().sort({V_ID: 1}).toArray()
	}

	static async updateGeneralVisitor(sample) {
		// Check if visitor exists
		const isExists = await visitors.findOne({ V_ID: sample.V_ID })
		if (isExists) {
			// Update the fields 
			const passwordHash = bcrypt.hashSync(sample.V_password, 10);
			await visitors.updateOne({
            	V_ID: sample.V_ID
            }, { 
				$set: {
					V_name: sample.V_name,
					V_age: sample.V_age,
					V_gender: sample.V_gender,
                	V_ICnum: sample.V_ICnum,
                	V_email: sample.V_email,
					V_contact: sample.V_contact,
               		V_blacklist: sample.V_blacklist,
					V_password: passwordHash
				} 
			}).then (result => {
                console.log(result)
            })
			return await visitors.findOne({ V_ID: sample.V_ID })
		}
		else {
			return { status: false }
		}
	}

	static async delete(vid, vname) {
		const isExists = await visitors.findOne({ V_ID: vid, V_name: vname })
		if (isExists) {
			await visitors.deleteOne({ V_ID: vid, V_name: vname }).then (result => {
                console.log(result.deletedCount)
            })
            return { status: "Deleted" }
		}
		return { status: "Not Found" }
	}
}

module.exports = Visitor;


