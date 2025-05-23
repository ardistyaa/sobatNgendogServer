import express from 'express';
import cors from 'cors';
import routes from './routes/index';  // Import kumpulan route
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Semua route
app.use('/api', routes);

// Fallback untuk route yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Middleware penanganan error global
app.use(errorHandler);

export default app;
