const { response } = require('express');
const supertest = require('supertest');
const request = supertest('http://localhost:3000');

/*
    Before test, make sure the database does not exist these documents -
    SampleVisitor1, SampleVisitorUpdate1, Reservation1, verifyReservation1,
    SampleAdmin1, SampleSecurity1, SampleSecurityUpdate1
*/

/*
    Before test, make sure the database exists these documents -
    existAdmin, existAdminUpdate, existVisitor, existReservation
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

const SampleVisitorUpdate1 = {
	"V_ID": 5,
	"V_name": "Ion",
	"V_age": 27,
	"V_gender": "Male",
	"V_ICnum": "950423-05-5555",
	"V_email": "ion123@gmail.com",
	"V_contact": "015-731 2465",
	"V_blacklist": false,
	"V_password": "87531"
};

const Reservation1 = {
    "R_ID": 104,
    "V_ID": 5,
    "V_name": "Ion",
    "R_date": "2022-10-03",
    "R_time": "09:00",
    "No_Counter": 4,
    "R_parkingLot": {
        "Slot": "A11",
        "No_Vehicle": "JHE 5321"
    }
}

const verifyReservation1 = {
    "R_ID": 104,
    "V_ID": 5,
    "V_name": "Ion",
    "R_date": "2022-10-20",
    "R_time": "15:00",
    "No_Counter": 4,
    "R_parkingLot": {
        "Slot": "A18",
        "No_Vehicle": "JHE 5321"
    }
}

const SampleAdmin1 = {
    "AdminName": "Gary",
    "AdminPassword": "Garypassword",
    "AdminEmail": "gary123@gmail.com",
    "AdminContact": "016-778 9121"
}

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

const existAdmin = {
    "AdminName": "Afiqah",
    "AdminPassword": "Afiqahpassword",
    "AdminEmail": "afiqah734@gmail.com",
    "AdminContact": "010-2854084"
}

const existAdminUpdate = {
    "AdminName": "Afiqah",
    "AdminPassword": "Afiqahpassword",
    "AdminEmail": "afiqah734@gmail.com",
    "AdminContact": "012-823 0121"
};

const existVisitor = {
    "V_ID": 3005,
    "V_name": "Tonny",
    "V_age": 35,
    "V_gender": "Male",
    "V_ICnum": "871221-16-1111",
    "V_email": "tonny123@gmail.com",
    "V_contact": "012-333 1234",
    "V_blacklist": false,
    "V_password": "13221"
}

const existReservation = {
    "R_ID": 1001,
    "V_ID": 3005,     
    "V_name": "Tonny",   
    "R_date": "2022-10-05",
    "R_time": "15:00",
    "No_Counter": 4,
    "R_parkingLot": {
        "Slot": "A16",
        "No_Vehicle": "YIW 5555"
    }
}

describe('Express Route Test', function () {

	/******************************** Security test ********************************/

	it('New security registration', async () => {
		return request
			.post('/register/security')
			.send(SampleSecurity1)
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toBe("Security Registeration Success");
			});
	});

	let tokenSecurity;

	it ('Login as security and it should return access token for security', async() => {
		const res = await request
			.post('/loginSecurity')
			.send({ SecurityName: SampleSecurity1.SecurityName, SecurityPassword: SampleSecurity1.SecurityPassword })
		tokenSecurity = res.body.token
	})

	it('"General Info Security update successfully', async () => {
		return request
			.patch('/security/updateGeneralInfoSecurity/Peter')
			.set('Authorization', `Bearer ${tokenSecurity}`)
			.send(SampleSecurityUpdate1)
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(response.body.SecurityName).toBe(SampleSecurityUpdate1.SecurityName);
				expect(response.body.SecurityEmail).toBe(SampleSecurityUpdate1.SecurityEmail);
				expect(response.body.SecurityContact).toBe(SampleSecurityUpdate1.SecurityContact);
				expect(response.body.role).toBe("security");
			});
	});

	it('"Password Security update successfully', async () => {
		return request
			.patch('/security/updatePasswordSecurity/Peter')
			.set('Authorization', `Bearer ${tokenSecurity}`)
			.send({ SecurityName: SampleSecurity1.SecurityName, SecurityPassword: SampleSecurity1.SecurityPassword })
			.expect('Content-Type', /text/)
			.expect(200)
			.then(response => {
				expect(response.text).toBe("Password update successful");
			});
	});

	it('"New admin registration', async () => {
		return request
			.post('/security/registerAdmin')
			.set('Authorization', `Bearer ${tokenSecurity}`)
			.send(SampleAdmin1)
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toBe("Admin Registeration Success");
			});
	});

	it('"Password Admin update successfully', async () => {
		return request
			.patch('/security/updatePasswordAdmin/Gary')
			.set('Authorization', `Bearer ${tokenSecurity}`)
			.send({ AdminName: SampleAdmin1.AdminName, AdminPassword: "sampleadmin1newpassword"})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(response => {
				expect(response.text).toBe("Password update successful");
			});
	});

	it('Admin deleted successful', async () => {
		return request
			.delete('/security/deleteAdmin/Gary')
			.set('Authorization', `Bearer ${tokenSecurity}`)
			.send({AdminName: SampleAdmin1.AdminName})
			.expect('Content-Type', /text/)
			.expect(200)
			.then(response => {
				expect(response.text).toBe("The admin is deleted");
			});
	});

	/******************************** Admin test ********************************/
	let tokenAdmin;

	it ('Login as admin and it should return access token for admin', async() => {
		const res = await request
			.post('/loginAdmin')
			.send({ AdminName: existAdmin.AdminName, AdminPassword: existAdmin.AdminPassword })
		tokenAdmin = res.body.token
	})

	it('"General Info Admin update successfully', async () => {
		return request
			.patch('/admin/updateGeneralInfoAdmin/Afiqah')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send(existAdminUpdate)
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(response.body.AdminName).toBe(existAdminUpdate.AdminName);
                expect(response.body.AdminEmail).toBe(existAdminUpdate.AdminEmail);
                expect(response.body.AdminContact).toBe(existAdminUpdate.AdminContact);
                expect(response.body.role).toBe("admin");
			});
	});

	it('New visitor registration', async() => {
		return request
			.post('/admin/registerVisitor')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send(SampleVisitor1)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body.V_ID).toBe(SampleVisitor1.V_ID);
                expect(response.body.V_name).toBe(SampleVisitor1.V_name);
                expect(response.body.V_age).toBe(SampleVisitor1.V_age);
                expect(response.body.V_gender).toBe(SampleVisitor1.V_gender);
                expect(response.body.V_ICnum).toBe(SampleVisitor1.V_ICnum);
                expect(response.body.V_email).toBe(SampleVisitor1.V_email);
                expect(response.body.V_contact).toBe(SampleVisitor1.V_contact);
                expect(response.body.V_blacklist).toBeFalsy();
            });
	});

	it('Register with duplicate visitor ID', async () => {
		return request
			.post('/admin/registerVisitor')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send(SampleVisitor1)
			.expect('Content-Type', /text/)
			.expect(404)
			.then(response => {
				expect(response.text).toEqual("The visitor's ID already exist!")
			});
	});

	it('Visitor info update successfully', async () => {
		return request
			.patch('/admin/updateInfoVisitor/5')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({ V_ID: SampleVisitorUpdate1.V_ID, V_name: SampleVisitorUpdate1.V_name })
			.send(SampleVisitorUpdate1)
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(response.body.V_ID).toBe(SampleVisitorUpdate1.V_ID);
                expect(response.body.V_name).toBe(SampleVisitorUpdate1.V_name);
                expect(response.body.V_age).toBe(SampleVisitorUpdate1.V_age);
                expect(response.body.V_gender).toBe(SampleVisitorUpdate1.V_gender);
                expect(response.body.V_ICnum).toBe(SampleVisitorUpdate1.V_ICnum);
                expect(response.body.V_email).toBe(SampleVisitorUpdate1.V_email);
                expect(response.body.V_contact).toBe(SampleVisitorUpdate1.V_contact);
                expect(response.body.V_blacklist).toBe(SampleVisitorUpdate1.V_blacklist);
			});
	});

	it('View a visitor info by Visitor ID', async () => {
		return request
			.post('/admin/viewVisitor/5')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({V_ID: SampleVisitorUpdate1.V_ID, V_name: SampleVisitorUpdate1.V_name})
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body.V_ID).toBe(SampleVisitorUpdate1.V_ID);
                expect(response.body.V_name).toBe(SampleVisitorUpdate1.V_name);
                expect(response.body.V_age).toBe(SampleVisitorUpdate1.V_age);
                expect(response.body.V_gender).toBe(SampleVisitorUpdate1.V_gender);
                expect(response.body.V_ICnum).toBe(SampleVisitorUpdate1.V_ICnum);
                expect(response.body.V_email).toBe(SampleVisitorUpdate1.V_email);
                expect(response.body.V_contact).toBe(SampleVisitorUpdate1.V_contact);
                expect(response.body.V_blacklist).toBe(SampleVisitorUpdate1.V_blacklist);
            });
	});

	it('View all visitor info', async () => {
		return request
			.get('/admin/viewAllVisitor')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send()
			.expect('Content-Type', /json/)
			.expect(200)
	});

	it('Create reservation', async () => {
		return request
			.post('/admin/createReservation/5')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({V_ID: SampleVisitorUpdate1.V_ID, V_name: SampleVisitorUpdate1.V_name})
			.send(Reservation1)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body.R_ID).toBe(Reservation1.R_ID);
				expect(response.body.V_ID).toBe(Reservation1.V_ID);
                expect(response.body.V_name).toBe(Reservation1.V_name);
                expect(response.body.R_date).toBe(Reservation1.R_date);
                expect(response.body.R_time).toBe(Reservation1.R_time);
                expect(response.body.No_Counter).toBe(Reservation1.No_Counter);
                expect(response.body.R_parkingLot.Slot).toBe(Reservation1.R_parkingLot.Slot);
                expect(response.body.R_parkingLot.No_Vehicle).toBe(Reservation1.R_parkingLot.No_Vehicle);
            });
	});

	it('Update reservation success', async () => {
		return request
			.patch('/admin/updateReservation/5')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({V_ID: SampleVisitorUpdate1.V_ID, V_name: SampleVisitorUpdate1.V_name})
			.send(verifyReservation1)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body.R_ID).toBe(verifyReservation1.R_ID);
				expect(response.body.V_ID).toBe(verifyReservation1.V_ID);
                expect(response.body.V_name).toBe(verifyReservation1.V_name);
                expect(response.body.R_date).toBe(verifyReservation1.R_date);
                expect(response.body.R_time).toBe(verifyReservation1.R_time);
                expect(response.body.No_Counter).toBe(verifyReservation1.No_Counter);
                expect(response.body.R_parkingLot.Slot).toBe(verifyReservation1.R_parkingLot.Slot);
                expect(response.body.R_parkingLot.No_Vehicle).toBe(verifyReservation1.R_parkingLot.No_Vehicle);
            });
	});

	it('Delete reservation', async () => {
		return request
			.delete('/admin/deleteReservation/5')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({V_ID: SampleVisitorUpdate1.V_ID, V_name: SampleVisitorUpdate1.V_name})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toBe("The reservation is deleted");
            });
	});

	it('Visitor delete successfully', async () => {
		return request
			.delete('/admin/deleteVisitor/5')
			.set('Authorization', `Bearer ${tokenAdmin}`)
			.send({ V_ID: SampleVisitorUpdate1.V_ID, V_name: SampleVisitorUpdate1.V_name })
			.expect('Content-Type', /text/)
			.expect(200)
			.then(response => {
				expect(response.text).toBe("The visitor is deleted");
			});
	});

	/******************************** Visitor test ********************************/
	let tokenVisitor;

	it ('Login as visitor and it should return access token for visitor', async() => {
		const res = await request
			.post('/loginVisitor')
			.send({ V_ID: existVisitor.V_ID, V_password: existVisitor.V_password })
		tokenVisitor = res.body.token
	})

	it('Visitor login invalid ID', async () => {
		return request
			.post('/loginVisitor')
			.send({ V_ID: 2, V_password: existVisitor.V_password })
			.expect('Content-Type', /text/)
			.expect(404).then(response => {
				expect(response.text).toEqual("Login failed");
			});
	});

	it('Visitor login invalid password', async () => {
		return request
			.post('/loginVisitor')
			.send({ V_ID: existVisitor.V_ID, V_password: "88831" })
			.expect('Content-Type', /text/)
			.expect(404).then(response => {
				expect(response.text).toBe("Login failed");
			});
	});

    it('Visitor view Access Info', async () => {
		return request
			.get('/visitor/ReservationInfo/3005')
			.set('Authorization', `Bearer ${tokenVisitor}`)
			.send({ V_ID: existVisitor.V_ID })
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
                expect(response.body.R_ID).toBe(existReservation.R_ID);
                expect(response.body.V_ID).toBe(existReservation.V_ID);
                expect(response.body.V_name).toBe(existReservation.V_name);
                expect(response.body.R_date).toBe(existReservation.R_date);
                expect(response.body.R_time).toBe(existReservation.R_time);
                expect(response.body.No_Counter).toBe(existReservation.No_Counter);
                expect(response.body.R_parkingLot.Slot).toBe(existReservation.R_parkingLot.Slot);
                expect(response.body.R_parkingLot.No_Vehicle).toBe(existReservation.R_parkingLot.No_Vehicle);
			})
	});

});


