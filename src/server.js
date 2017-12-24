require('dotenv').config({silent: true});
import bodyParser from 'body-parser';
import { sendResponseJsonFromXml } from './utils/xml';
import cheerio from 'cheerio';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import superagent from 'superagent';
const PHILLY_VOICE_RSS_URL = 'http://www.phillyvoice.com/feed/tag/flyers/';
const server = express();

server.use(cors());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.set('views', path.join(__dirname, '/views'));
server.set('view engine', 'ejs');

server.use('/assets/javascripts', express.static('client/build'));

server.get('/', (request, response) => {
  response.render('index', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

server.get('/news', (request, response) => {
  let stringXml = '';
  http.get(PHILLY_VOICE_RSS_URL, (res) => {
    res.on('data', chunk => {
      stringXml += chunk;
    });

    res.on('end', () => {
      sendResponseJsonFromXml(response, stringXml);
    });
  })
  .on('error', e => {
    console.log('ERROR: ' + e.message);
  });
});

server.get('/feature-image', (request, response) => {
  const { url } = request.query;
  superagent.get(url)
    .then(res => {
      const $ = cheerio.load(res.text);
      const img = $('.feature-image').find('img');
      let imageSrc;
      img.each((index, image) => {
        if (image.attribs.alt.toLowerCase().indexOf('logo') === -1) imageSrc = image.attribs.src;
      });
      const imageCredit = $('.article-image-credit')[0].children[0].data.trim();
      response.json({ image: { src: imageSrc, credit: imageCredit }});
    })
    .catch(e => {
      response.json({ image: null });
    });
});

server.listen(3000);
console.log('SERVER RUNNING PORT 3000');
