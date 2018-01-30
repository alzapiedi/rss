export const store = [];
export const subStore = [];

export const addItem = item => store.push(item);

export const updateImage = (id, image) => {
  const item = store.find(x => x.id === id);
  if (item) item.image = image;
}

export const replace = subset => subStore = subset;

export default {
  store,
  subStore,
  addItem,
  replace,
  updateImage
}
