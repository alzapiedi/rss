import cheerio from 'cheerio';
import http from 'http';
import superagent from 'superagent';
import { addItem, updateImage } from './store';
import { parseString } from 'rss-parser';

const feeds = [
  'http://www.phillyvoice.com/feed/tag/flyers/',
  'http://www.phillyvoice.com/feed/tag/eagles/',
  'http://www.phillyvoice.com/feed/channel/philadelphia-news/',
  'http://www.phillyvoice.com/feed/tag/food-drink/',
  'http://www.phillyvoice.com/feed/tag/politics/',
  'http://www.phillyvoice.com/feed/tag/education/'
];

export default function fetchFeeds() {
  feeds.forEach(url => {
    let stringXml = '';
    http.get(url, (res) => {
      res.on('data', chunk => {
        stringXml += chunk;
      });

      res.on('end', () => {
        parseString(stringXml, (err, parsedXml) => {
          if (err) return console.log('XML PARSE FAILED!');
          const { entries } = parsedXml.feed;
          entries.forEach(entry => {
            addItem({
              author: entry.creator._.trim(),
              tags: entry.categories,
              body: entry.content,
              date: entry.pubDate,
              title: entry.title,
              link: entry.link
            });
            fetchImage(entry.link);
          });
        });
      });
    })
    .on('error', e => {
      console.log('ERROR: ' + e.message);
    });
  });
}

function fetchImage(url) {
  superagent.get(url)
    .then(res => {
      const $ = cheerio.load(res.text);
      const img = $('.feature-image').find('img');
      let imageSrc;
      img.each((index, image) => {
        if (image.attribs.alt.toLowerCase().indexOf('logo') === -1) imageSrc = image.attribs.src;
      });
      const imageCredit = $('.article-image-credit')[0].children[0].data.trim();
      updateImage(url, { src: imageSrc, credit: imageCredit });
    })
    .catch(error => console.log(error.message))
}
