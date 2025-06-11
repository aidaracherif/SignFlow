const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Nodejs Express + Postgres API',
    description: 'Nodejs Express + Postgres API'
  },
  host: 'localhost:3000',
  schema: ['http'],
};

const outputFile = './swagger-output.json';
const endponitsFiles = ['./server.js'];


swaggerAutogen(outputFile, endponitsFiles, doc).then(() => {
  require('./server.js'); 
});