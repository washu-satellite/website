import { reset } from 'drizzle-seed';
import { db } from '.';
import * as schema from "./schema";

async function triggerReset() {
    await reset(db, schema);
}

triggerReset()
  .then(() => {
    console.log("Reset database")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Failed to reset database:", error)
    process.exit(1)
  });