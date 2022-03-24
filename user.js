const { faker } = require('@faker-js/faker');
const { faker_zh_CN } = require('@faker-js/faker/locale/zh_CN');
//const randomName = faker.name.findName(); // Rowan Nikolaus
//const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
//const randomPhoneNumber = faker.phone.phoneNumber(); // (279) 329-8663 x30233

// // console.log("Name:", randomName, "      Email:", randomEmail, "     Phone number:", randomPhoneNumber);

const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const avatarUrl = faker.image.avatar();
const address = faker.address.city();
//const zh_CN_fullName = `${faker_zh_CN.name.firstName()} ${faker_zh_CN.name.lastName()}`;
var randomPassword = faker.internet.password();

const User = ({
    name: fullName,
    // zh_cn_name: zh_CN_fullName,
    avatar_URL: avatarUrl,
    address: address,
    password: randomPassword
})

console.log(User)
// console.log(`
// Faker Demo

// Name: ${fullName} 
// City: ${address}

// Avatar URL: ${avatarUrl}

// Password: ${randomPassword}
// `)

module.exports = User




