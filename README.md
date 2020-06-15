# Ewan Morrison - Toptal screening process - Time Management Application

## Set up instructions

### Pre requisites

- Node installed at version 10.X
- NPM installed at version 6.X
- An MSSQL instance running at localhost:11 with an empty database created called glasshour.

### UI

- Navigate to the app folder. `cd .\app\`.
- Run `npm install`.
- Run `npm run start`. Should host at localhost:1234.

### API

- Create a database user with read/write permissions for the API to execute SQL queries on the database.
- Create a gmail account which allows third party app access.
- Add a .env file to "/api" folder with contents as such:
```
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password

JWT_SECRET=secret-to-sign-jwt-tokens

EMAIL_USER=address@gmail.com
EMAIL_PASSWORD=your-gmail-password

APPLICATION_URL=http://localhost:1234
```
- Navigate to the app folder. `cd .\api\`.
- Run `npm install`.
- Run `npm run start`. Should host at localhost:3000.

## Technologies used

### UI
The front end is written in Typescript/React and uses SCSS for styling. Recoil is used for minimalist state management. Cypress is used for end to end testing.

### API
The api is written in Typescript running on the NestJS framework and makes use of typeorm Object-Relational Mapping to perform database queries. The migrations are managed through typeorm also. JWT tokens are used for authentication as well as magic links as a means to reset passwords. There is a postman collection to test the API.