const { response } = require('express');
const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	// it('should return hello benr2423', async () => {
	// 	return request.get('/hello')
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('Hello BENR2423');
	// 		});
	// })

	it('login successfully', async () => {
		return request
			.post('/login')
			.send({username: 'Ali', password: "12345" })
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						Name: expect.any(String),
						Password: expect.any(String),
					})
				);
			});
	});

	it('login failed', async () => {
		return request
			.post('/login')
			.send({username: 'Kel', password: "35123" })
			.expect('Content-Type', /text/)
			.expect(404)
			.then(response => {
				expect(response.text).toEqual("Login failed")
			});
	});

	it('register', async () => {
		return request
			.post('/register')
			.send({username: 'Tonny', password: "32123" })
			.expect('Content-Type', /text/)
			.expect(200)
			.then(response => {
				expect(response.text).toEqual("The user is saved.");
			});
	});

	it('register failed', async () => {
		return request
			.post('/register')
			.send({username: 'Ali', password: "12345" })
			.expect('Content-Type', /text/)
			.expect(404).then(response => {
				expect(response.text).toEqual("User already exits!");
			});
	});

	it('update', async () => {
		return request
			.patch('/update/Ali')
			.send({username: "Ali", age: 22})
			.expect('Content-Type', /json/)
            .expect(200)
			.then(response => {
				expect(response.body.Name).toBe("Ali");
				expect(response.body.Age).toEqual(22);
			});
	});

    it('update failed', async () => {
		return request
			.patch('/update/Kel')
			.send({username: 'Kel'})
			.expect('Content-Type', /text/)
			.expect(404).then(response => {
				expect(response.text).toBe("The user information is not updated.");
			})
	});

	it('should return user information', async () => {
		return request
			.get('/login/Ali')
			.send({username: 'Ali', password: "12345" })
			.expect('Content-Type', /json/)
			.expect(200).then(res => {
				expect(JSON.stringify(res.body)).toBe(JSON.stringify(
					{	_id: "627922773d9523a80191c8cd",
						Name: 'Ali',
						Password: "$2a$10$kuVroEPQ9Odt4oref5eae.c8PM.PDLmyQWY13fyaz.sW571zlURMO",
						Age: 22
					}
				))
			});
	})

    it('deleted', async () => {
		return request
			.delete('/delete/Tonny')
			.send({username: 'Tonny'})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toEqual("Deleted!");
			})
	});

    it('delete failed', async () => {
		return request
			.delete('/delete/Kel')
			.send({username: 'Kel'})
			.expect('Content-Type', /text/)
			.expect(404).then(response => {
				expect(response.text).toEqual("Failed to delete!");
			})
	});

});


