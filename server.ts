import express from 'express';
import cors from 'cors';
import { config } from './server/config/env';
import interpretRoutes from './server/routes/interpret.routes';

const app = express();
const port = config.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/interpret', interpretRoutes);

app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
