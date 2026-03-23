require('dotenv').config();


const mongoose = require('mongoose');
const AccessCode = require('../lib/models/accessCode').default;
const { connectDB } = require('../lib/db');
const XLSX = require('xlsx');
const path = require('path');

const EXCEL_PATH = path.join(__dirname, 'combined_members_no_scientific.xlsx');

async function main() {
  await connectDB();

  // Read Excel file
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  // Debug: print first row to check column names
  if (rows.length > 0) {
    console.log('First row of Excel:', rows[0]);
  } else {
    console.log('Excel file read, but no rows found.');
  }
  // Expecting columns: regno, memberId (case-insensitive)
  const bulk = rows
    .map((row: any) => {
      const regno = row.reg_no;
      const memberId = row.member_id;
      if (!regno || !memberId) return undefined;
      return {
        updateOne: {
          filter: { regno: String(regno).trim(), memberId: String(memberId).trim() },
          update: { $setOnInsert: { regno: String(regno).trim(), memberId: String(memberId).trim(), used: false } },
          upsert: true,
        },
      };
    })
    .filter((op: any) => !!op);

  if (bulk.length === 0) {
    console.error('No valid regno/memberId pairs found in Excel.');
    process.exit(1);
  }

  const result = await AccessCode.bulkWrite(bulk, { ordered: false });
  const inserted = result.upsertedCount;
  const skipped = bulk.length - inserted;
  console.log(`Access codes seeded from Excel. Inserted: ${inserted}, already existed: ${skipped}`);
}

main()
  .catch((err) => {
    console.error('Failed to seed access codes from Excel', err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
