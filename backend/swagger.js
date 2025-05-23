// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration de base Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de gestion RH',
    version: '1.0.0',
    description: 'Documentation de l\'API pour la gestion des utilisateurs, documents et clients',
  },
  servers: [
    {
      url: 'http://localhost:3000/api', // modifie si besoin
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  /*
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de gestion de documents',
      version: '1.0.0',
      description: 'Documentation de l\'API de documents (congé, contrat)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
},
security: [{
  bearerAuth: []
}],*/
swaggerDefinition,

  apis: ['./src/routes/*.js'], // ou './controllers/*.js' selon où tu mets les commentaires
};

const swaggerSpec = swaggerJsDoc(options);



const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
