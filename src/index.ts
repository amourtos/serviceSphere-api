import express, { Express, Request, Response } from 'express';
import { ILogObj, Logger } from 'tslog';
import connectDb from './config/mongo';
import * as bodyParser from 'body-parser';

const app: Express = express();
const log: Logger<ILogObj> = new Logger();

const port = process.env.PORT;

// Connect to MongoDB
connectDb();
// configs
app.use(bodyParser.json());

// routes
// test
app.get('/', (req: Request, res: Response) => {
  res.send('Typescript and node works');
});

// listen
app.listen(port, () => {
  log.info(`Listening on ${port}`);
});
