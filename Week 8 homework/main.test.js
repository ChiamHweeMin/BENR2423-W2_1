const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	it('should return hello benr2423', async () => {
		return request.get('/hello')
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Hello BENR2423');
			});
	})

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
});


