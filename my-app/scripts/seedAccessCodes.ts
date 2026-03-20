import mongoose from 'mongoose';
import AccessCode from '../lib/models/accessCode';
import { connectDB } from '../lib/db';

// Add or edit codes here. They are single-use.
const CODES = [
  'FREEPASS-IECSE-01',
  'FREEPASS-IECSE-02',
  'FREEPASS-IECSE-03',
  'FREEPASS-IECSE-04',
  'FREEPASS-IECSE-05',
];

async function main() {
  await connectDB();

  const bulk = CODES.map((code) => ({
    updateOne: {
      filter: { code },
      update: { $setOnInsert: { code, used: false } },
      upsert: true,
    },
  }));

  const result = await AccessCode.bulkWrite(bulk, { ordered: false });
  const inserted = result.upsertedCount;
  const skipped = CODES.length - inserted;

  // eslint-disable-next-line no-console
  console.log(`Access codes seeded. Inserted: ${inserted}, already existed: ${skipped}`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to seed access codes', err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
