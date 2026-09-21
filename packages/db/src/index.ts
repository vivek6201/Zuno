import 'dotenv/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === "production"
  }
});

export * from "./schema"
export * from "drizzle-orm";
export * as z from "zod"
export default db;