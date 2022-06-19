let reservations;

class Reservation {
	static async injectDB(conn) {
		reservations = await conn.db("Bank_VMS").collection("Reservation")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} vname 
	 * @param {*} vid
	 */

	static async createReservation(sample) {
		const isExists = await reservations.findOne({ R_ID: sample.R_ID })
		if (isExists) { 
			return { status: "Duplicate reservation ID exists"}
		}
		else {
			const timeFull = await reservations.findOne({
				"R_date": sample.R_date,
				"R_time": sample.R_time,
				"No_Counter": sample.No_Counter
			})
			if (timeFull) {
				return { status: "Duplicate time exists" }
			} 
			else {
				const parkingFull = await reservations.findOne({
					"R_date": sample.R_date,
					"R_time": sample.R_time,
					"R_parkingLot.Slot": sample.R_parkingLot.Slot
				})
				if (parkingFull) {
					return { status: "Duplicate parking lot at the same time"}
				} else {
					await reservations.insertOne({
						R_ID: sample.R_ID,
						V_ID: sample.V_ID,
						V_name: sample.V_name,
						R_date: sample.R_date,
						R_time: sample.R_time,
						No_Counter: sample.No_Counter,
						R_parkingLot: {
							Slot: sample.R_parkingLot.Slot,
							No_Vehicle: sample.R_parkingLot.No_Vehicle
						}
					}).then (result => {
							console.log(result)
					})
					console.log("The reservation is successfully booked.")
					return await reservations.findOne({R_ID: sample.R_ID})
				}
			}
		}
	}

	static async getReservation(vid) {
		const isExists = await reservations.findOne({ V_ID: vid })
		if (isExists) {
			return isExists
		} else {
			return { status: "Error Not Found" }
		}
	}

	static async viewAllReservation() {
		return await reservations.find().sort({ R_ID: 1 }).toArray()
	}

	static async updateReservation(sample) {
		const isExists = await reservations.findOne({ R_ID: sample.R_ID })
		if (isExists) { 
			const timeFull = await reservations.findOne({
				"R_date": sample.R_date,
				"R_time": sample.R_time,
				"No_Counter": sample.No_Counter
			})
			if (timeFull) {
				return { status: "Duplicate time exists" }
			} 
			else {
				const parkingFull = await reservations.findOne({
					"R_date": sample.R_date,
					"R_time": sample.R_time,
					"R_parkingLot.Slot": sample.R_parkingLot.Slot
				})
				if (parkingFull) {
					return { status: "Duplicate parking lot at the same time"}
				} else {
					await reservations.updateOne({
						R_ID: sample.R_ID,
						V_ID: sample.V_ID
					}, {
						$set: {
							V_name: sample.V_name,
							R_date: sample.R_date,
							R_time: sample.R_time,
							No_Counter: sample.No_Counter,
							R_parkingLot: {
								Slot: sample.R_parkingLot.Slot,
								No_Vehicle: sample.R_parkingLot.No_Vehicle
							}
						}
					}).then (result => {
						console.log(result)
					})
					console.log("Reservation updated successfully.")
					return await reservations.findOne({ R_ID: sample.R_ID })
				}
			}
		}
		else {
			return { status: "Reservation ID not exists" }
		}
	}

	static async delete(vid, vname) {
		const isExists = await reservations.findOne({ V_ID: vid, V_name: vname })
		if (isExists) {
			await reservations.deleteOne({ V_ID: vid, V_name: vname }).then (result => {
                		console.log(result.deletedCount)
            		})
            		return { status: "Deleted" }
		}
		return { status: "Not Found" }
	}
}

module.exports = Reservation;


