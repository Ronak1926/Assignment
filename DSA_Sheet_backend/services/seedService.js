import Topic from '../model/Topic.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadSeedData = () => {
  const filePath = path.join(__dirname, 'seedData.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const seedDatabase = async () => {
  try {
    const count = await Topic.countDocuments();
    if (count === 0) {
      const seedData = loadSeedData();
      await Topic.insertMany(seedData);
      console.log('Database seeded successfully');
    } else {
      console.log('Database already seeded');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedDatabase;
