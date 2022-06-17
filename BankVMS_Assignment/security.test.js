const MongoClient = require("mongodb").MongoClient;
const Security = require("./security")

/* 
   Before test, make sure the database does not exist the documents -
   SampleSecurity1, SampleSecurityUpdate1 
*/

const SampleSecurity1 = {
    "SecurityName": "Peter",
    "SecurityPassword": "Peterpassword",
    "SecurityEmail": "peter123@gmail.com",
    "SecurityContact": "016-731 0231"
}

const SampleSecurityUpdate1 = {
    "SecurityName": "Peter",
    "SecurityPassword": "Peterpassword",
    "SecurityEmail": "peter123@gmail.com",
    "SecurityContact": "011-731 0231"
}

describe("Security Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase",
			{ useNewUrlParser: true },
		);
		Security.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New security registration", async () => {
		const res = await Security.register(SampleSecurity1)
		expect(res.status).toBe(true)
	})

	test("Security login successfully", async () => {
		const res = await Security.login(SampleSecurity1.SecurityName, SampleSecurity1.SecurityPassword)
		expect(res.SecurityName).toBe("Peter"),
		expect(res.SecurityEmail).toBe("peter123@gmail.com"),
		expect(res.SecurityContact).toBe("016-731 0231"),
		expect(res.role).toBe("security")
	})

	test("General Info Security update successfully ", async () => {
		const res = await Security.updateGeneralSecurity(SampleSecurityUpdate1)
		expect(res.SecurityName).toBe(SampleSecurityUpdate1.SecurityName),
		expect(res.SecurityEmail).toBe(SampleSecurityUpdate1.SecurityEmail),
		expect(res.SecurityContact).toBe(SampleSecurityUpdate1.SecurityContact),
		expect(res.role).toBe("security")
	})

    test("Password Security update successfully ", async () => {
		const res = await Security.updatePassSecurity(SampleSecurityUpdate1.SecurityName, SampleSecurityUpdate1.SecurityPassword)
		expect(res.status).toBe(true)
	})

});


