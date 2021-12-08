# backend-challenge

## Development environment

This project was done in Windows using Node.js v16.13.0, NPM v8.1.0 and MongoDB Compass v1.29.5.

## Setup Instructions

1) Install Node.js. To be able to handle multiple Node.js versions, it's recommended to install [NVM for Windows](https://github.com/coreybutler/nvm-windows) (Node Version Manager). After installed, follow the instructions in the documentation about how to manage your Node.js versions.
2) Install MongoDB. This project used [MongoDB Compass](https://www.mongodb.com/try/download/community) which is a GUI for interacting with your MongoDB databases. The database is configured with the default location, so if you wish to use any other location, please change the corresponding database URL in the main.js file.
3) In the project root, open a terminal and run `npm install` to install all the project dependencies.

## Running the project

In a terminal, run `node main.js` to execute the program. This syntax can vary depending on the operating system you are working. For example, in Windows it may be needed to change it for `node .\main.js`.


## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io).
