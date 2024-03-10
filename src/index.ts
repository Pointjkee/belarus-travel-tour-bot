import { config } from 'dotenv';
// import { startApp } from './app';
import express from "express";
import { port } from "./config/config";

config();
const app = express();
app.get('/', (req, res) => {
  res.send('Test log');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
