const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")
const Reservation = require("./reservation")

/* 
   Before test, make sure the database does not exist the documents -
   SampleReservation1 
*/

const SampleReservation1 = {
    "R_ID": 101,
    "V_ID": 2,
    "V_name": "Leong",
    "R_date": "2022-10-13",
    "R_time": "12:00",
    "No_Counter": 5,
    "R_parkingLot": {
        "Slot": "A12",
        "No_Vehicle": "PWD 2222"
    }
}

describe("Reservation Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
		Reservation.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("Create reservation", async () => {
		const res = await Reservation.createReservation(SampleReservation1)
		expect(res.R_ID).toBe(101),
		expect(res.V_ID).toBe(2),
		expect(res.V_name).toBe("Leong"),
		expect(res.R_date).toBe("2022-10-13"),
		expect(res.R_time).toBe("12:00"),
		expect(res.No_Counter).toBe(5),
		expect(res.R_parkingLot.Slot).toBe("A12"),
		expect(res.R_parkingLot.No_Vehicle).toBe("PWD 2222")
	})

	test("Update reservation success", async () => {
		const SampleReservationUpdate1 = {
			"R_ID": 101,
			"V_ID": 2,
			"V_name": "Leong",
			"R_date": "2022-10-19",
			"R_time": "14:00",
			"No_Counter": 5,
			"R_parkingLot": {
				"Slot": "A12",
				"No_Vehicle": "PWD 2222"
			}
		}
		const res = await Reservation.updateReservation(SampleReservationUpdate1)
		expect(res.R_ID).toBe(101),
		expect(res.V_ID).toBe(2),
		expect(res.V_name).toBe("Leong"),
		expect(res.R_date).toBe("2022-10-19"),
		expect(res.R_time).toBe("14:00"),
		expect(res.No_Counter).toBe(5),
		expect(res.R_parkingLot.Slot).toBe("A12"),
		expect(res.R_parkingLot.No_Vehicle).toBe("PWD 2222")
	})

	test("Reservation deleted successful", async () => {
		const res = await Reservation.delete(SampleReservation1.V_ID, SampleReservation1.V_name)
		expect(res.status).toBe("Deleted")
	})
});


