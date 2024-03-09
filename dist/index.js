"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = require("./config");
console.log('HELLO! 1');
const bot = new telegraf_1.Telegraf(config_1.token);
