require('dotenv').config({silent: true});
import { addToDB, store, subStore } from './store';
import bodyParser from 'body-parser';
import cheerio from 'cheerio';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fetchFeeds from './fetchFeeds';
import fs from 'fs';
import http from 'http';
import path from 'path';
import superagent from 'superagent';

const server = express();

fetchFeeds();

server.use(cors());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.set('views', path.join(__dirname, '/views'));
server.set('view engine', 'ejs');

server.use('/assets', express.static('client/build'));

server.get('/', (request, response) => {
  response.render('index');
});

server.get('/news', (request, response) => {
  console.log('GET /news');
  response.json({ entries: store });
});

server.get('/rss', (request, response) => {
  response.json({ entries: store });
});

server.post('/add', (request, response) => {
  if (!subStore.some(entry => entry.link === request.body.entry.link)) addToDB(request.body.entry);
  response.json({ status: 'ok' });
});

server.listen(3000);
console.log('SERVER RUNNING PORT 3000');
