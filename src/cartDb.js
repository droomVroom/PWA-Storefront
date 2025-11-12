import { openDB } from 'idb';

const DB_NAME = 'pwastorefront';
const STORE_CART = 'cart';

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_CART)) {
        db.createObjectStore(STORE_CART, { keyPath: '_id' });
      }
    }
  });
}

export async function getCart() {
  const db = await getDb();
  return (await db.getAll(STORE_CART)) || [];
}

export async function setCart(cart) {
  const db = await getDb();
  await db.clear(STORE_CART);
  for (const item of cart) {
    await db.put(STORE_CART, item);
  }
}
