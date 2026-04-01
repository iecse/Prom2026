import { MongoClient } from 'mongodb';
import fs from 'fs';

async function main() {
  // Replace <username> and <password> with your actual MongoDB Atlas credentials
  const uri = "uri";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const filter = { 'registeredEvents.eventName': 'negSpace' };
    const project = { phone: 1, _id: 0 };

    const cursor = client
      .db('test')
      .collection('users')
      .find(filter, { projection: project });

    const phones = [];
    await cursor.forEach(doc => {
      if (doc.phone) phones.push(doc.phone);
    });

    // Convert to plain text (one per line)
    const data = phones.join('\n');

    fs.writeFileSync('phones.txt', data);

    console.log(`Saved ${phones.length} phone numbers to phones.txt`);

  } finally {
    await client.close();
  }
}

main().catch(console.error);