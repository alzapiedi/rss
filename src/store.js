import fs from 'fs';

export const store = [];
export const subStore = JSON.parse(fs.readFileSync(__dirname + '/data.txt'));

export const addItem = item => store.push(item);

export const addToDB = item => {
  console.log(item);
  subStore.push(item);
  fs.writeFileSync(__dirname + '/data.txt', JSON.stringify(subStore));
}

export const updateImage = (id, image) => {
  const item = store.find(x => x.id === id);
  if (item) item.image = image;
}

export default {
  store,
  subStore,
  addItem,
  updateImage
}
