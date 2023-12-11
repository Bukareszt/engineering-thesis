import axios from 'axios';
import express, { Request, Response } from 'express';

const app = express();
const port = 3002;

app.use(express.json());

app.post('/execute/:id', async (req: Request, res: Response) => {
  console.log(`Action ${req.params.id} was executed`);
  await axios.post(`http://localhost:3001/workflows/executed/${req.params.id}`);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
