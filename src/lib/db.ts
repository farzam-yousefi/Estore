// lib/db.ts
"use server";
import { MongoClient, Db, Collection, Document, ObjectId, WithId } from "mongodb";
import { object } from "zod";

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

export async function selectCollectionDocs<T extends Document>(
  collName: string,
): Promise<(Omit<T, "_id"> & { id: string })[]> {
  try {
    const collection = await getCollection<T>(collName);
    const data = await collection.find({}).toArray();

    // Convert ObjectId to string
    return data.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
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
////////////////////////////////////////////
export async function selectDocWithId<T extends Document>(
  collName: string,
  id: string
): Promise <WithId<T>|null> {
  console.log("fffff",id)
  try {
    const collection = await getCollection<T>(collName);
    return await collection.findOne({ _id: new ObjectId(id) } as any);
  } catch (e) {
    throw new Error("Select was failed");
  }
}



export async function findIdByName(collName:string , objectName:string):Promise <ObjectId> {
   try {
    const collection = await getCollection(collName);
    const doc= await collection.findOne({ name: objectName , projection:{_id :1}});
    if (!doc?._id) {
      throw new Error("Document not found");
    }

    return doc._id;
  } catch (e) {
    throw new Error("Select was failed");
  }
}

export function mapDocToClient<T extends { _id: ObjectId }>(
  doc: T
): Omit<T, "_id"> & {id: string } {
  return {
    ...doc,
    id: doc._id.toString(),
  };
}

export function convertObjectId<T extends { _id: ObjectId }>(
  doc: T
): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
  };
}

// export function convertObjectId<T extends { _id?: ObjectId }>(
//   doc: T
// ): Omit<T, "_id"> & { id?: string } {
//   const { _id, ...rest } = doc;

//   return {
//     ...rest,
//     id: _id?.toString(),
//   };
// }

