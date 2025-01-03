import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.port || 4000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.listen(port, () => {
  console.log('Server listening on port', port);
});
