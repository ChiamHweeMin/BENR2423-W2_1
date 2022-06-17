const { MongoClient, ObjectId } = require("mongodb");
const Admin = require("./admin");
const Visitor = require("./visitor");
const Reservation = require("./reservation");
const Security = require("./security");

MongoClient.connect(
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ficgu.mongodb.net/myFirstDatabase",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	Admin.injectDB(client);
	Visitor.injectDB(client);
	Reservation.injectDB(client);
	Security.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
		basePath: "/",
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				}
			}
		},
		security: [{
			bearerAuth: []
		}]
	},
	apis: ['./main.js'],
}
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/***************************************  ADMIN FUNCTION  ****************************************/
//         Register, Login, Update (Visitor and Admin), Delete, View Reservation Info            //
//                          Manage Visitor and Reservation collections                           // 

app.post('/loginAdmin', async (req, res) => {
	console.log("Admin login:")
	console.log(req.body);
	const admin = await Admin.login(req.body.AdminName, req.body.AdminPassword);

	if (admin.status == "Invalid password" || admin.status == "Invalid admin name" ) {
		return res.status(404).send("Login failed")
	}

	res.status(200).json({
		AdminName: admin.AdminName,
		AdminEmail: admin.AdminEmail,
		AdminContact: admin.AdminContact,
		role: admin.role,
		token: generateAccessToken({
			AdminName: admin.AdminName,
			role: admin.role
		})
	})
})

/**
 * @swagger
 * /loginAdmin:
 *   post:
 *     description: Login as Admin
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AdminName:
 *                 type: string
 *               AdminPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminInfo'
 *       404:
 *         description: Login failed
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminInfo:
 *       type: object
 *       properties:
 *         AdminName:
 *           type: string
 *         AdminEmail: 
 *           type: string
 *         AdminContact:
 *           type: string
 *         role:
 *           type: string
 */

app.patch('/admin/updateGeneralInfoAdmin/:AdminName', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		console.log("Update General Info Admin:")
		console.log(req.body);
		schemaAdmin = {
			AdminName: req.params.AdminName,
			AdminEmail: req.body.AdminEmail,
			AdminContact: req.body.AdminContact
		}
		const admin = await Admin.updateGeneralAdmin(schemaAdmin);
		if (admin.status == false) {
			return res.status(404).send("Update failed")
		} 
		res.status(200).json({
			AdminName: admin.AdminName,
			AdminEmail: admin.AdminEmail,
			AdminContact: admin.AdminContact,
			role: admin.role
		})
	} else {
		return res.status(403).send('Unauthorized')
	}	
})

/**
 * @swagger
 * /admin/updateGeneralInfoAdmin/{AdminName}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update General Info Admin
 *     parameters:
 *       - in: path  
 *         name: AdminName
 *         schema:
 *           type: string
 *         required: true
 *         decription: AdminName
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AdminName:
 *                 type: string
 *               AdminEmail:
 *                 type: string
 *               AdminContact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminInfo'
 *       404:
 *         description: Update failed
 *       403:
 *         description: Unauthorized
 */

app.post('/admin/registerVisitor', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		console.log("Visitor registeration:")
		console.log(req.body);
		schemaVisitor = {
			V_ID: req.body.V_ID,
			V_name: req.body.V_name,
			V_age: req.body.V_age,
			V_gender: req.body.V_gender,
			V_ICnum: req.body.V_ICnum,
			V_email: req.body.V_email,
			V_contact: req.body.V_contact,
			V_blacklist: req.body.V_blacklist,
			V_password: req.body.V_password
		}
		const visitor = await Visitor.register(schemaVisitor);
		if (visitor.status == false) {
			return res.status(404).send("The visitor's ID already exist!")
		} 
		return res.status(200).json(visitor)
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/registerVisitor:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Visitor registeration
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               V_ID:
 *                 type: integer
 *               V_name:
 *                 type: string
 *               V_age:
 *                 type: integer
 *               V_gender:
 *                 type: string
 *               V_ICnum:
 *                 type: string
 *               V_email:
 *                 type: string
 *               V_contact:
 *                 type: string
 *               V_blacklist:
 *                 type: boolean
 *               V_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Register success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisitorInfo'
 *       404:
 *         description: The visitor's ID already exist!
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VisitorInfo:
 *       type: object
 *       properties:
 *         V_ID:
 *           type: integer
 *         V_name:
 *           type: string
 *         V_age:
 *           type: integer
 *         V_gender:
 *           type: string
 *         V_ICnum:
 *           type: string
 *         V_email:
 *           type: string
 *         V_contact:
 *           type: string
 *         V_blacklist:
 *           type: boolean
 *         V_password:
 *           type: string
 *         role:
 *           type: string
 */

app.post('/admin/viewVisitor/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		const visitor = await Visitor.getVisitor(Number(req.params.V_ID), req.body.V_name);
		if (visitor.status == "Error Not Found" ) {
			return res.status(404).send("404 Not Found")
		}
		return res.status(200).json(visitor)
	} else {
		return res.status(403).send('Unauthorized')
	}	
})

/**
 * @swagger
 * /admin/viewVisitor/{V_ID}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Find visitor by id and name
 *     parameters:
 *       - in: path
 *         name: V_ID
 *         schema:
 *           type: integer
 *         require: true
 *         description: Visitor ID
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               V_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Query Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisitorInfo'
 *       404:
 *         description: 404 Not Found
 *       403:
 *         description: Unauthorized  
 */

app.get('/admin/viewAllVisitor', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		Visitor.viewAllVisitor(req.params).then(visitor => res.status(200).send(visitor))
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/viewAllVisitor:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: View All Visitor Info
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisitorInfo'
 *       403:
 *         description: Unauthorized
 */

app.patch('/admin/updateInfoVisitor/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		console.log("Update Info Visitor")
		console.log(req.params)
		const visitor = await Visitor.getVisitor(Number(req.params.V_ID), req.body.V_name);
		if (visitor.status == "Error Not Found" ) {
			return res.status(404).send("404 Not Found")
		}
		else 
		{
			schemaVisitor = {
				V_ID: req.body.V_ID,
				V_name: req.body.V_name,
				V_age: req.body.V_age,
				V_gender: req.body.V_gender,
				V_ICnum: req.body.V_ICnum,
				V_email: req.body.V_email,
				V_contact: req.body.V_contact,
				V_blacklist: req.body.V_blacklist,
				V_password: req.body.V_password
			}
			const visitor = await Visitor.updateGeneralVisitor(schemaVisitor)
			if (visitor.status == false ) {
				return res.status(404).send("Error")
			}
			return res.status(200).json(visitor)
		}
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/updateInfoVisitor/{V_ID}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update Info Visitor
 *     parameters:
 *       - in: path  
 *         name: V_ID
 *         schema:
 *           type: integer
 *         required: true
 *         decription: Visitor ID
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               V_ID:
 *                 type: integer
 *               V_name:
 *                 type: string
 *               V_age:
 *                 type: integer
 *               V_gender:
 *                 type: string
 *               V_ICnum:
 *                 type: string
 *               V_email:
 *                 type: string
 *               V_contact:
 *                 type: string
 *               V_blacklist:
 *                 type: boolean
 *               V_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisitorInfo'
 *       404:
 *         description: Error
 *       403:
 *         description: Unauthorized
 */

app.delete('/admin/deleteVisitor/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		const visitor = await Visitor.delete(Number(req.params.V_ID), req.body.V_name);
		const reservation = await Reservation.delete(Number(req.params.V_ID), req.body.V_name);
		if (visitor.status == "Not Found") {
			return res.status(404).send("Failed to delete")
		}
		else {
			return res.status(200).send("The visitor is deleted")
		}
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/deleteVisitor/{V_ID}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete Visitor
 *     parameters:
 *       - in: path
 *         name: V_ID
 *         schema:
 *           type: integer
 *         require: true
 *         description: Visitor ID
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               V_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The visitor is deleted
 *       404:
 *         description: Failed to delete
 *       403:
 *         description: Unauthorized
 */

app.post('/admin/createReservation/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		console.log("Create Reservation")
		console.log(req.params)
		const visitor = await Visitor.getVisitor(Number(req.params.V_ID), req.body.V_name);
		if (visitor.status == "Error Not Found" ) {
			return res.status(404).send("404 Not Found")
		}
		else if (visitor.V_blacklist == true) {
			return res.status(406).send("In BLACKLIST!")
		} 
		else 
		{
			schemaReservation = {
				R_ID: req.body.R_ID,
				V_ID: visitor.V_ID,
				V_name: visitor.V_name,
				R_date: req.body.R_date,
				R_time: req.body.R_time,
				No_Counter: req.body.No_Counter,
				R_parkingLot: {
					Slot: req.body.R_parkingLot.Slot,
					No_Vehicle: req.body.R_parkingLot.No_Vehicle
				}
			}
			const reservation = await Reservation.createReservation(schemaReservation)
			if (reservation.status == "Duplicate reservation ID exists" ) {
				return res.status(422).send("Duplicate ID")
			}
			else if (reservation.status == "Duplicate time exists") {
				return res.status(422).send("Duplicate Time")
			}
			else if (reservation.status == "Duplicate parking lot at the same time") {
				return res.status(422).send("Duplicate Parking")
			} 
			return res.status(200).json(reservation)
		}
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/createReservation/{V_ID}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Create Reservation
 *     parameters:
 *       - in: path
 *         name: V_ID
 *         schema:
 *           type: integer
 *         require: true
 *         description: Visitor ID
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               R_ID:
 *                 type: integer
 *               V_ID:
 *                 type: integer
 *               V_name:
 *                 type: string
 *               R_date:
 *                 type: string
 *               R_time:
 *                 type: string
 *               No_Counter:
 *                 type: integer
 *               R_parkingLot:
 *                 type: object
 *                 properties:
 *                   Slot:
 *                     type: string
 *                   No_Vehicle:
 *                     type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationInfo'
 *       422:
 *         description: Duplicate Error
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservationInfo:
 *       type: object
 *       properties:
 *         R_ID:
 *           type: integer
 *         V_ID:
 *           type: integer
 *         V_name:
 *           type: string
 *         R_date:
 *           type: string
 *         R_time:
 *           type: string
 *         No_Counter:
 *           type: integer
 *         R_parkingLot:
 *           type: object
 *           properties:
 *             Slot:
 *               type: string
 *             No_Vehicle:
 *               type: string
 */

app.get('/admin/viewAllReservation', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		Reservation.viewAllReservation(req.params).then(reservation => res.status(200).send(reservation))
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/viewAllReservation:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: View All Reservation Info
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationInfo'
 *       403:
 *         description: Unauthorized
 */

app.patch('/admin/updateReservation/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		console.log("Update Reservation Visitor")
		console.log(req.params)
		const visitor = await Visitor.getVisitor(Number(req.params.V_ID), req.body.V_name);
		if (visitor.status == "Error Not Found" ) {
			return res.status(404).send("404 Not Found")
		}
		else if (visitor.V_blacklist == true) {
			return res.status(406).send("In BLACKLIST!")
		} 
		else 
		{
			schemaReservation = {
				R_ID: req.body.R_ID,
				V_ID: visitor.V_ID,
				V_name: visitor.V_name,
				R_date: req.body.R_date,
				R_time: req.body.R_time,
				No_Counter: req.body.No_Counter,
				R_parkingLot: {
					Slot: req.body.R_parkingLot.Slot,
					No_Vehicle: req.body.R_parkingLot.No_Vehicle
				}
			}
			const reservation = await Reservation.updateReservation(schemaReservation)
			if (reservation.status == "Reservation ID not exists" ) {
				return res.status(404).send("Not Found")
			}
			else if ( 
				(reservation.status == "Duplicate time exists") || 
				(reservation.status == "Duplicate parking lot at the same time")
				) {
				return res.status(422).send("Duplicate Error")
			} 
			return res.status(200).json(reservation)
		}
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/updateReservation/{V_ID}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update Reservation Info
 *     parameters:
 *       - in: path  
 *         name: V_ID
 *         schema:
 *           type: integer
 *         required: true
 *         decription: Visitor ID
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               R_ID:
 *                 type: integer
 *               V_ID:
 *                 type: integer
 *               V_name:
 *                 type: string
 *               R_date:
 *                 type: string
 *               R_time:
 *                 type: string
 *               No_Counter:
 *                 type: integer
 *               R_parkingLot:
 *                 type: object
 *                 properties:
 *                   Slot:
 *                     type: string
 *                   No_Vehicle:
 *                     type: string
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationInfo'
 *       404:
 *         description: 404 Not Found
 *       406:
 *         description: In BLACKLIST!
 *       422:
 *         description: Duplicate Error
 *       403:
 *         description: Unauthorized
 */

app.delete('/admin/deleteReservation/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'admin') {
		const reservation = await Reservation.delete(Number(req.params.V_ID), req.body.V_name);
		if (reservation.status == "Not Found") {
			return res.status(404).send("Failed to delete")
		}
		else {
			return res.status(200).send("The reservation is deleted")
		}
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /admin/deleteReservation/{V_ID}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete Reservation
 *     parameters:
 *       - in: path
 *         name: V_ID
 *         schema:
 *           type: integer
 *         require: true
 *         description: Visitor ID
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               V_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The reservation is deleted
 *       404:
 *         description: Failed to delete
 *       403:
 *         description: Unauthorized
 */

/***************************************  VISITOR FUNCTION  ***************************************/
//                                 Login, View Reservation Info                                   //

app.post('/loginVisitor', async (req, res) => {
	console.log("Visitor login:")
	console.log(req.body);
	const visitor = await Visitor.login(req.body.V_ID, req.body.V_password);

	if (visitor.status == "Invalid password" || visitor.status == "Invalid visitor ID" ) {
		return res.status(404).send("Login failed")
	}
	return res.status(200).json({
		visitor,
		token: generateAccessToken({
			V_name: visitor.V_name,
			role: visitor.role
		}) 
	})
})

/**
 * @swagger
 * /loginVisitor:
 *   post:
 *     description: Login as Visitor
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               V_ID:
 *                 type: integer
 *               V_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisitorInfo'
 *       404:
 *         description: Login failed
 */

app.get('/visitor/ReservationInfo/:V_ID', verifyToken, async (req, res) => {
	if (req.user.role == 'visitor') {
		console.log("View Reservation Info:")
		console.log(req.params)
		const reservation = await Reservation.getReservation(Number(req.params.V_ID));
	
		if (reservation.status == "Error Not Found" ) {
			return res.status(404).send("404 Not found")
		}
		return res.status(200).json(reservation)
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /visitor/ReservationInfo/{V_ID}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: View Reservation Info
 *     parameters:
 *       - in: path
 *         name: V_ID
 *         schema:
 *           type: integer
 *         require: true
 *         description: Visitor ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationInfo'
 *       404:
 *         description: 404 Not found
 *       403:
 *         description: Unauthorized
 *       
 */

/***************************************  SECURITY FUNCTION  ***************************************/
//         Register, Login, Update (Visitor and Admin), Delete, View Reservation Info              //
//                  Register, Login, Manage Admin collections, View Visitor Info                   //

app.post('/register/security', async (req, res) => {
	console.log("Security registeration:")
	console.log(req.body);
	schemaSecurity = {
		SecurityName: req.body.SecurityName,
		SecurityPassword: req.body.SecurityPassword,
		SecurityEmail: req.body.SecurityEmail,
		SecurityContact: req.body.SecurityContact
	}
	const secure = await Security.register(schemaSecurity);
	if (secure.status == false) {
		return res.status(404).send("The name is already in use!")
	} 
	return res.status(200).send("Security Registeration Success")	
})

/**
 * @swagger
 * /register/security:
 *   post:
 *     description: Security registeration
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SecurityName:
 *                 type: string
 *               SecurityPassword:
 *                 type: string
 *               SecurityEmail:
 *                 type: string
 *               SecurityContact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Security Registeration Success
 *       404:
 *         description: The name is already in use!
 */

app.post('/loginSecurity', async (req, res) => {
	console.log("Security login:")
	console.log(req.body);
	const secure = await Security.login(req.body.SecurityName, req.body.SecurityPassword);

	if (secure.status == "Invalid password" || secure.status == "Invalid security name" ) {
		return res.status(404).send("Login failed")
	}

	res.status(200).json({
		SecurityName: secure.SecurityName,
		SecurityEmail: secure.SecurityEmail,
		SecurityContact: secure.SecurityContact,
		role: secure.role,
		token: generateAccessToken({
			SecurityName: secure.SecurityName,
			role: secure.role
		})
	})
})

/**
 * @swagger
 * /loginSecurity:
 *   post:
 *     description: Login as Security
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SecurityName:
 *                 type: string
 *               SecurityPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecurityInfo'
 *       404:
 *         description: Login failed
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SecurityInfo:
 *       type: object
 *       properties:
 *         SecurityName:
 *           type: string
 *         SecurityEmail: 
 *           type: string
 *         SecurityContact:
 *           type: string
 *         role:
 *           type: string
 */

app.patch('/security/updateGeneralInfoSecurity/:SecurityName', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		console.log("Update General Info Security:")
		console.log(req.body);
		schemaSecurity = {
			SecurityName: req.params.SecurityName,
			SecurityEmail: req.body.SecurityEmail,
			SecurityContact: req.body.SecurityContact
		}
		const secure = await Security.updateGeneralSecurity(schemaSecurity);
		if (secure.status == false) {
			return res.status(404).send("Update failed")
		} 
	
		res.status(200).json({
			SecurityName: secure.SecurityName,
			SecurityEmail: secure.SecurityEmail,
			SecurityContact: secure.SecurityContact,
			role: secure.role
		})
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /security/updateGeneralInfoSecurity/{SecurityName}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update General Info Security
 *     parameters:
 *       - in: path  
 *         name: SecurityName
 *         schema:
 *           type: string
 *         required: true
 *         decription: Security Name
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SecurityName:
 *                 type: string
 *               SecurityEmail:
 *                 type: string
 *               SecurityContact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecurityInfo'
 *       404:
 *         description: Update failed
 *       403:
 *         description: Unauthorized
 */

app.patch('/security/updatePasswordSecurity/:SecurityName', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		console.log("Update Password Security:")
		console.log(req.body);
	
		const secure = await Security.updatePassSecurity(req.params.SecurityName, req.body.SecurityPassword);
		if (secure.status == false) {
			return res.status(404).send("Password update failed")
		} 
		res.status(200).send("Password update successful")
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /security/updatePasswordSecurity/{SecurityName}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update Password Security
 *     parameters:
 *       - in: path  
 *         name: SecurityName
 *         schema:
 *           type: string
 *         required: true
 *         decription: Security Name
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SecurityPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password update successful
 *       404:
 *         description: Password update failed
 *       403:
 *         description: Unauthorized
 */

app.get('/security/viewAllAdmin', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		Admin.viewAllAdmin(req.params).then(admin => res.status(200).send(admin))
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /security/viewAllAdmin:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: View All Admin Info
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminInfo'
 *       403:
 *         description: Unauthorized
 */

app.get('/security/viewAllVisitor', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		Visitor.viewAllVisitor(req.params).then(visitor => res.status(200).send(visitor))
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /security/viewAllVisitor:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: View All Visitor Info
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisitorInfo'
 *       403:
 *         description: Unauthorized
 */

app.post('/security/registerAdmin', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		console.log("Admin registeration:")
		console.log(req.body);
		schemaAdmin = {
			AdminName: req.body.AdminName,
			AdminPassword: req.body.AdminPassword,
			AdminEmail: req.body.AdminEmail,
			AdminContact: req.body.AdminContact
		}
		const admin = await Admin.register(schemaAdmin);
		if (admin.status == false) {
			return res.status(404).send("The name is already in use!")
		} 
		return res.status(200).send("Admin Registeration Success")	
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /security/registerAdmin:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: Admin registeration
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AdminName:
 *                 type: string
 *               AdminPassword:
 *                 type: string
 *               AdminEmail:
 *                 type: string
 *               AdminContact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin Registeration Success
 *       404:
 *         description: The name is already in use!
 *       403:
 *         description: Unauthorized
 */

app.patch('/security/updatePasswordAdmin/:AdminName', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		console.log("Update Password Admin:")
		console.log(req.body);
	
		const admin = await Admin.updatePassAdmin(req.params.AdminName, req.body.AdminPassword);
		if (admin.status == false) {
			return res.status(404).send("Password update failed")
		} 
		res.status(200).send("Password update successful")
	} else {
		return res.status(403).send('Unauthorized')
	}

})

/**
 * @swagger
 * /security/updatePasswordAdmin/{AdminName}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: Update Password Admin
 *     parameters:
 *       - in: path  
 *         name: AdminName
 *         schema:
 *           type: string
 *         required: true
 *         decription: Admin Name
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AdminPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password update successful
 *       404:
 *         description: Password update failed
 *       403:
 *         description: Unauthorized
 */

app.delete('/security/deleteAdmin/:AdminName', verifyToken, async (req, res) => {
	if (req.user.role == 'security') {
		const admin = await Admin.delete(req.params.AdminName);
		if (admin.status == "Not Found") {
			return res.status(404).send("Failed to delete")
		}
		else {
			return res.status(200).send("The admin is deleted")
		}	
	} else {
		return res.status(403).send('Unauthorized')
	}
})

/**
 * @swagger
 * /security/deleteAdmin/{AdminName}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: Delete Admin
 *     parameters:
 *       - in: path
 *         name: AdminName
 *         schema:
 *           type: string
 *         require: true
 *         description: Admin Name
 *     responses:
 *       200:
 *         description: The admin is deleted
 *       404:
 *         description: Failed to delete
 *       403:
 *         description: Unauthorized
 */

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) {
		return res.sendStatus(401)
	}

	jwt.verify(token, "my-super-secret", (err, user) => {
		console.log(err)

		if (err) {
			return res.sendStatus(403)
		}
		req.user = user
		next()
	})
}

