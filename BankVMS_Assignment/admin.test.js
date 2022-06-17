const MongoClient = require("mongodb").MongoClient;
const Admin = require("./admin")

/* 
   Before test, make sure the database does not exist the documents -
   SampleAdmin1, SampleUpdateAdmin1 
*/

const SampleAdmin1 = {
    "AdminName": "Ryan",
    "AdminPassword": "Ryanpassword",
    "AdminEmail": "ryan123@gmail.com",
    "AdminContact": "013-778 0121"
}

const SampleAdminUpdate1 = {
    "AdminName": "Ryan",
    "AdminPassword": "Ryan123password",
    "AdminEmail": "ryan334@gmail.com",
    "AdminContact": "012-556 0121"
};

describe("Admin Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase",
			{ useNewUrlParser: true },
		);
		Admin.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New admin registration", async () => {
		const res = await Admin.register(SampleAdmin1)
		expect(res.status).toBe(true)
	})

	test("Admin login successfully", async () => {
		const res = await Admin.login(SampleAdmin1.AdminName, SampleAdmin1.AdminPassword)
		expect(res.AdminName).toBe("Ryan"),
		expect(res.AdminEmail).toBe("ryan123@gmail.com"),
		expect(res.AdminContact).toBe("013-778 0121"),
		expect(res.role).toBe("admin")
	})

	test("General Info Admin update successfully ", async () => {
		const res = await Admin.updateGeneralAdmin(SampleAdminUpdate1)
		expect(res.AdminName).toBe(SampleAdminUpdate1.AdminName),
		expect(res.AdminEmail).toBe(SampleAdminUpdate1.AdminEmail),
		expect(res.AdminContact).toBe(SampleAdminUpdate1.AdminContact),
		expect(res.role).toBe("admin")
	})

    test("Password Admin update successfully ", async () => {
		const res = await Admin.updatePassAdmin(SampleAdminUpdate1.AdminName, SampleAdminUpdate1.AdminPassword)
		expect(res.status).toBe(true)
	})

	test("Admin deleted successful", async () => {
		const res = await Admin.delete(SampleAdminUpdate1.AdminName)
		expect(res.status).toBe("Deleted")
	})
});


