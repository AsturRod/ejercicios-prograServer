import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Rutas API
app.use('/api', routes);

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Error de servidor' });
});

export default app;