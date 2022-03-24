// Import stylesheets
import './styles.css';
import { faker } from '@faker-js/faker';
import faker_zh_CN from '@faker-js/faker/locale/zh_CN';

const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const avatarUrl = faker.image.avatar();
const address = faker.address.city();
const zh_CN_fullName = `${faker_zh_CN.name.firstName()} ${faker_zh_CN.name.lastName()}`;

const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `
<h1>Faker Demo</h1>
<br>
<b>Name:</b> ${fullName} <br>
<b>City:</b> ${address}
<br>
<br>
<b>Avatar URL:</b> ${avatarUrl}
<img src="${avatarUrl}" />
<br>
<br>
<br>
<b>zh_CN Name:</b> ${zh_CN_fullName}
`;



