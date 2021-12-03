import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRouter from './routes/posts.js';
import oathRouter from './routes/user.js';
const app = express();
dotenv.config();


app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

app.use(express.json());
app.use('/posts', postRouter);
app.use('/users', oathRouter);

app.get('/', (req, res) => {
  res.send('Hello to Memories API');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);

