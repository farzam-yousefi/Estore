// lib/db.ts

import { MongoClient, Db, Collection, Document } from "mongodb"

const uri = process.env.DB_URI!
let db: Db

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

async function connectToDatabase(): Promise<Db> {
  if (db) return db

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }

  const client = await global._mongoClientPromise
  db = client.db("store_db")
  return db
}

export async function getCollection<T extends Document>(
  name: string
): Promise<Collection<T>> {
  const database = await connectToDatabase()
  return database.collection<T>(name)
}
