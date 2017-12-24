import { parseString } from 'rss-parser';

export const sendResponseJsonFromXml = (response, stringXml) => {
  parseString(stringXml, (err, parsedXml) => {
    if (err) response.status(500).json({ errorMessage: 'Something went wrong' }).end();
    const  { title, description, entries } = parsedXml.feed;
    const responseJson = { title, description, orig: parsedXml };
    responseJson.entries = entries.map(entry => {
      return {
        author: entry.creator._.trim(),
        tags: entry.categories,
        body: entry.content,
        date: entry.pubDate,
        title: entry.title,
        link: entry.link
      };
    });
    response.json(responseJson);
  });
}
