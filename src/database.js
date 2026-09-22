import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const dataDir = path.resolve('data');
const dataFile = path.join(dataDir, 'database.json');

const initialData = {
  users: [],
  courses: [
    {
      id: randomUUID(),
      title: 'Introdução à Programação',
      description: 'Fundamentos de lógica e desenvolvimento para iniciantes.',
      category: 'Tecnologia',
      workloadHours: 20,
      provider: 'AprendeAí',
      free: true,
      createdAt: new Date().toISOString()
    }
  ],
  enrollments: []
};

export async function readDatabase() {
  try {
    return JSON.parse(await fs.readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2));
    return structuredClone(initialData);
  }
}

export async function writeDatabase(database) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(database, null, 2));
}

export { randomUUID };
