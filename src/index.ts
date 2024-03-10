import {Telegraf} from "telegraf";
import axios from 'axios'
import {config} from 'dotenv'
import express from 'express'
import {port} from "./config";

config()
const app = express()
app.get('/',(req,res)=>{
    res.send('Test log')
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})

// const TELEGRAM_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN ?? '')
