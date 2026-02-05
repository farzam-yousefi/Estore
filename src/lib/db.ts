// lib/db.ts

"use server";
import { MongoClient, Db, Collection, Document, ObjectId } from "mongodb";

const uri = process.env.DB_URI!;
if (!uri) {
  throw new Error("DB_URI is not defined in environment variables");
}

let db: Db;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  const client = await global._mongoClientPromise;
  db = client.db("store_db");
  return db;
}

export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T>> {
  const database = await connectToDatabase();
  return database.collection<T>(name);
}

export async function insertInCollection(collName: string, object: object) {
  try {
    const collection = await getCollection(collName);
    await collection.insertOne(object);
  } catch (e) {
    throw new Error("Insert was failed");
  }
}

export async function selectCollectionDos<T extends Document>(
  collName: string,
): Promise<(Omit<T, "_id"> & { _id: string })[]> {
  try {
    const collection = await getCollection<T>(collName);
    const data = await collection.find({}).toArray();

    // Convert ObjectId to string
    return data.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  } catch (e) {
    throw new Error("Select was failed");
  }
}

export async function deleteDocument(colName: string, _id: string) {
  try {
    const collection = await getCollection(colName);
    await collection.deleteOne({ _id: new ObjectId(_id) });
  } catch (e) {
    throw new Error("Delete was failed");
  }
}
