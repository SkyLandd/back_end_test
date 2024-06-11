import { Client } from "pg";

export const client = new Client({
  host: process.env.HOST,
  port: 5432,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

client.connect();
