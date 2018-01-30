import cheerio from 'cheerio';
import http from 'http';
import superagent from 'superagent';
import { addItem, updateImage } from './store';
import { parseString } from 'rss-parser';

let ID = 1;

const feeds = [
  { url: 'http://www.phillyvoice.com/feed/tag/flyers/', emoji: 'hockey', coordinate: { latitude: 39.90122, longitude: -75.172 } }
];

export default function fetchFeeds() {
  feeds.forEach(feed => {
    let stringXml = '';
    http.get(feed.url, (res) => {
      res.on('data', chunk => {
        stringXml += chunk;
      });

      res.on('end', () => {
        parseString(stringXml, (err, parsedXml) => {
          if (err) return console.log('XML PARSE FAILED!');
          const  { entries } = parsedXml.feed;
          entries.forEach(entry => {
            addItem({
              id: ID,
              author: entry.creator._.trim(),
              tags: entry.categories,
              body: entry.content,
              date: entry.pubDate,
              title: entry.title,
              link: entry.link,
              coordinate: feed.coordinate,
              emoji: feed.emoji
            });
            fetchImage(entry.link, ID++);
          });
        });
      });
    })
    .on('error', e => {
      console.log('ERROR: ' + e.message);
    });
  });
}

function fetchImage(url, id) {
  superagent.get(url)
    .then(res => {
      const $ = cheerio.load(res.text);
      const img = $('.feature-image').find('img');
      let imageSrc;
      img.each((index, image) => {
        if (image.attribs.alt.toLowerCase().indexOf('logo') === -1) imageSrc = image.attribs.src;
      });
      const imageCredit = $('.article-image-credit')[0].children[0].data.trim();
      updateImage(id, { src: imageSrc, credit: imageCredit });
    })
}