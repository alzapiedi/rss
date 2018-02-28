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

server.get('/feed', (request, response) => {
  console.log('GET /feed');
  const result = subStore.map(entry => {
    const { coordinates, ...rest } = entry;
    return {
      coordinates: { latitude: Number(coordinates.latitude), longitude: Number(coordinates.longitude) },
      ...rest
    }
  })
  response.json({ entries: result });
});

server.get('/rss', (request, response) => {
  console.log('GET /rss');
  response.json({ entries: store });
});

server.post('/add', (request, response) => {
  console.log('POST /add');
  if (subStore.some(entry => entry.link === request.body.entry.link)) return response.json({ status: 'error' });
  addToDB(request.body.entry);
  console.log('Successfully added entry');
  response.json({ status: 'ok' });
});

server.listen(4000);
console.log('SERVER RUNNING PORT 4000');

setTimeout(() => console.log(store), 20000)
