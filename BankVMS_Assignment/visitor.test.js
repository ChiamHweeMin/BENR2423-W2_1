const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor")
const Reservation = require("./reservation")

/* 
   Before test, make sure the database does not exist the documents -
   SampleVisitor1
*/

/* 
   Before test, make sure the database exists the documents -
   verifyReservation1
*/

const SampleVisitor1 = {
	"V_ID": 5,
	"V_name": "Ion",
	"V_age": 27,
	"V_gender": "Male",
	"V_ICnum": "950423-05-5555",
	"V_email": "ion123@gmail.com",
	"V_contact": "015-555 5555",
	"V_blacklist": false,
	"V_password": "87531"
};

const verifyReservation1 = {
    "R_ID": 100,
    "V_ID": 1,
    "V_name": "Koo",
    "R_date": "2022-10-11",
    "R_time": "09:00",
    "No_Counter": 2,
    "R_parkingLot": {
        "Slot": "A11",
        "No_Vehicle": "JND 1111"
    }
};

describe("Visitor Account", () => {
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

	test("New visitor registration", async () => {
		const res = await Visitor.register(SampleVisitor1)
		expect(res.V_ID).toBe(5),
		expect(res.V_name).toBe("Ion"),
		expect(res.V_age).toBe(27),
		expect(res.V_gender).toBe("Male"),
		expect(res.V_ICnum).toBe("950423-05-5555"),
		expect(res.V_email).toBe("ion123@gmail.com"),
		expect(res.V_contact).toBe("015-555 5555"),
		expect(res.V_blacklist).toBeFalsy()
	})

	test("Register with duplicate visitor ID", async () => {
		const res = await Visitor.register(SampleVisitor1)
		expect(res.status).toBeFalsy()
	})

	test("Visitor login successfully", async () => {
		const res = await Visitor.login(SampleVisitor1.V_ID, SampleVisitor1.V_password)
		expect(res.V_ID).toBe(5),
		expect(res.V_name).toBe("Ion"),
		expect(res.V_age).toBe(27),
		expect(res.V_gender).toBe("Male"),
		expect(res.V_ICnum).toBe("950423-05-5555"),
		expect(res.V_email).toBe("ion123@gmail.com"),
		expect(res.V_contact).toBe("015-555 5555"),
		expect(res.V_blacklist).toBeFalsy()
	})

	test("Visitor login invalid password", async () => {
		const res = await Visitor.login(SampleVisitor1.V_ID, "14412")
		expect(res.status).toBe("Invalid password")
	})

    test("Get Visitor successfully ", async () => {
		const res = await Visitor.getVisitor(SampleVisitor1.V_ID, SampleVisitor1.V_name)
		expect(res.V_ID).toBe(5),
		expect(res.V_name).toBe("Ion"),
		expect(res.V_age).toBe(27),
		expect(res.V_gender).toBe("Male"),
		expect(res.V_ICnum).toBe("950423-05-5555"),
		expect(res.V_email).toBe("ion123@gmail.com"),
		expect(res.V_contact).toBe("015-555 5555"),
		expect(res.V_blacklist).toBeFalsy()
	})

	test("Visitor update successfully ", async () => {
		const SampleVisitorUpdate1 = {
			"V_ID": 5,
			"V_name": "Ion",
			"V_age": 28,
			"V_gender": "Male",
			"V_ICnum": "950423-05-5555",
			"V_email": "ion123@gmail.com",
			"V_contact": "016-555 5555",
			"V_blacklist": false,
			"V_password": "87531"
		};
		const res = await Visitor.updateGeneralVisitor(SampleVisitorUpdate1)
		expect(res.V_ID).toBe(SampleVisitorUpdate1.V_ID),
		expect(res.V_name).toBe(SampleVisitorUpdate1.V_name),
		expect(res.V_age).toBe(SampleVisitorUpdate1.V_age),
		expect(res.V_gender).toBe(SampleVisitorUpdate1.V_gender),
		expect(res.V_ICnum).toBe(SampleVisitorUpdate1.V_ICnum),
		expect(res.V_email).toBe(SampleVisitorUpdate1.V_email),
		expect(res.V_contact).toBe(SampleVisitorUpdate1.V_contact),
		expect(res.V_blacklist).toBeFalsy()
	})

	test("Visitor deleted successful", async () => {
		const res = await Visitor.delete(SampleVisitor1.V_ID, SampleVisitor1.V_name)
		expect(res.status).toBe("Deleted")
	})
	
	test("Get Visitor failed ", async () => {
		const res = await Visitor.getVisitor("1", SampleVisitor1.V_name)
		expect(res.status).toBe("Error Not Found")
	})

	test("Visitor view Access Info", async () => {
		const res = await Reservation.getReservation(1)
		expect(res.R_ID).toBe(verifyReservation1.R_ID)
		expect(res.V_ID).toBe(verifyReservation1.V_ID)
		expect(res.V_name).toBe(verifyReservation1.V_name)
		expect(res.R_date).toBe(verifyReservation1.R_date)
		expect(res.R_time).toBe(verifyReservation1.R_time)
		expect(res.No_Counter).toBe(verifyReservation1.No_Counter)
		expect(res.R_parkingLot.Slot).toBe(verifyReservation1.R_parkingLot.Slot)
		expect(res.R_parkingLot.No_Vehicle).toBe(verifyReservation1.R_parkingLot.No_Vehicle)
	})
});


