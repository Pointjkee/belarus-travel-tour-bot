import {Telegraf} from "telegraf";
import axios from 'axios'
import {config} from 'dotenv'
import express from 'express'

config()
const app = express()
const port = 3000;
app.get('/',(req,res)=>{
    res.send('Test log')
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})

// const TELEGRAM_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN ?? '')
