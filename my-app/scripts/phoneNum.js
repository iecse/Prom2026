import { MongoClient } from 'mongodb';
import fs from 'fs';

async function main() {
  const uri = "mongouri";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const phones = await client
      .db('test')
      .collection('users')
      .distinct('phone');

    // Convert to plain text (one per line)
    const data = phones.join('\n');

    fs.writeFileSync('phones.txt', data);

    console.log(`Saved ${phones.length} phone numbers to phones.txt`);

  } finally {
    await client.close();
  }
}

main().catch(console.error);