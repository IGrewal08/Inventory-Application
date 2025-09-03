#! /usr/bin/env node
import { Pool } from "pg";
import "dotenv/config";

export default Pool({
  host: "localhost",
  user: process.env.ROLE_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.ROLE_PASSWORD,
  host: 5432,
});
