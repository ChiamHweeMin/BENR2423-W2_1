const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("User Account", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await User.register("Ahmad", "21223")
		expect(res).toBe(true)
	})

	test("Duplicate username", async () => {
		const res = await User.register("Ali", "12345")
		expect(res).toBe(false)
	})

	test("User login invalid username", async () => {
		const res = await User.login("Li", "12345")
		expect(res).toBe("Invalid username!")
	})

	test("User login invalid password", async () => {
		const res = await User.login("Ali", "14412")
		expect(res).toBe("Invalid password!")
	})

	test("User login successfully", async () => {
		const res = await User.login("Ali", "12345")
		expect(JSON.stringify(res)).toBe(JSON.stringify(
			{	_id: "627922773d9523a80191c8cd",
				Name: 'Ali',
				Password: "$2a$10$kuVroEPQ9Odt4oref5eae.c8PM.PDLmyQWY13fyaz.sW571zlURMO",
                Age: 22
			}
		))
	})

    test("User update successfully", async () => {
		const res = await User.update("Ali", 25)
		expect(res.Name).toBe("Ali")
        expect(res.Age).toBe(25)
	})

    test("User update failed", async () => {
		const res = await User.update("no_user", 25)
		expect(res).toBe("The username is not exits!")
	})

    test("User delete successfully", async () => {
		const res = await User.delete("Ahmad")
		expect(res).toBe("The user is deleted!")
	})

    test("User delete failed", async () => {
		const res = await User.delete("no_user")
		expect(res).toBe("The username is not exits!")
	})
});