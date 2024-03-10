import express from 'express';
// import { Bot } from './bot';
import { port } from './config/config';
// import { ConfigService } from './config/config,service';

export async function startApp() {
  const app = express();
  app.get('/', (req, res) => {
    res.send('Test log');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  // const bot = new Bot(new ConfigService());
  // await bot.init();
}
