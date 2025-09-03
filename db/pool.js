#! /usr/bin/env node
import { Pool } from "pg";
import "dotenv/config";

export default Pool({
  host: "localhost",
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PASS,
  host: 5432,
});
