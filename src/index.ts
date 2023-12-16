import express, { Express, Request, Response } from 'express';
import connectDb from './config/mongo';
import * as bodyParser from 'body-parser';
import { BoardPostController } from './controllers/BoardPost.controller';
import { UserController } from './controllers/User.controller';
import { logger } from './config/logger';
import cookieParser from 'cookie-parser';

const app: Express = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDb();
// configs
app.use(bodyParser.json());
app.use(cookieParser());

// routes
// test
app.get('/', (req: Request, res: Response) => {
  res.send('Typescript and node works');
});

app.use('/board-posts', new BoardPostController().router);
app.use('/user', new UserController().router);

// listen
app.listen(port, () => {
  logger.info(`Listening on ${port}`);
});
