import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readDatabase, writeDatabase, randomUUID } from './database.js';
import { swaggerDocument } from './swagger.js';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const required = (value) => typeof value === 'string' && value.trim().length > 0;
const positiveNumber = (value) => Number.isInteger(value) && value > 0;

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'AprendeAí API', timestamp: new Date().toISOString() }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/users', asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!required(name) || !required(email) || !email.includes('@')) return res.status(400).json({ error: 'name e email válido são obrigatórios.' });
  const db = await readDatabase();
  if (db.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ error: 'E-mail já cadastrado.' });
  const user = { id: randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), createdAt: new Date().toISOString() };
  db.users.push(user);
  await writeDatabase(db);
  res.status(201).json(user);
}));

app.get('/users', asyncHandler(async (req, res) => res.json((await readDatabase()).users)));

app.get('/courses', asyncHandler(async (req, res) => {
  const { category, free, search } = req.query;
  let courses = (await readDatabase()).courses;
  if (category) courses = courses.filter((course) => course.category.toLowerCase() === category.toLowerCase());
  if (free !== undefined) courses = courses.filter((course) => course.free === (free === 'true'));
  if (search) courses = courses.filter((course) => `${course.title} ${course.description}`.toLowerCase().includes(search.toLowerCase()));
  res.json(courses);
}));

app.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = (await readDatabase()).courses.find((item) => item.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });
  res.json(course);
}));

app.post('/courses', asyncHandler(async (req, res) => {
  const { title, description, category, workloadHours, provider = 'AprendeAí', free = true } = req.body;
  if (![title, description, category].every(required) || !positiveNumber(workloadHours) || typeof free !== 'boolean') {
    return res.status(400).json({ error: 'title, description, category, workloadHours positivo e free booleano são obrigatórios.' });
  }
  const db = await readDatabase();
  const course = { id: randomUUID(), title: title.trim(), description: description.trim(), category: category.trim(), workloadHours, provider: String(provider).trim(), free, createdAt: new Date().toISOString() };
  db.courses.push(course);
  await writeDatabase(db);
  res.status(201).json(course);
}));

app.put('/courses/:id', asyncHandler(async (req, res) => {
  const db = await readDatabase();
  const index = db.courses.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Curso não encontrado.' });
  const current = db.courses[index];
  const next = { ...current, ...req.body };
  if (![next.title, next.description, next.category].every(required) || !positiveNumber(next.workloadHours) || typeof next.free !== 'boolean') return res.status(400).json({ error: 'Dados do curso inválidos.' });
  db.courses[index] = next;
  await writeDatabase(db);
  res.json(next);
}));

app.delete('/courses/:id', asyncHandler(async (req, res) => {
  const db = await readDatabase();
  const exists = db.courses.some((course) => course.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Curso não encontrado.' });
  db.courses = db.courses.filter((course) => course.id !== req.params.id);
  db.enrollments = db.enrollments.filter((enrollment) => enrollment.courseId !== req.params.id);
  await writeDatabase(db);
  res.status(204).send();
}));

app.post('/enrollments', asyncHandler(async (req, res) => {
  const { userId, courseId } = req.body;
  const db = await readDatabase();
  if (!db.users.some((user) => user.id === userId)) return res.status(404).json({ error: 'Usuário não encontrado.' });
  if (!db.courses.some((course) => course.id === courseId)) return res.status(404).json({ error: 'Curso não encontrado.' });
  if (db.enrollments.some((item) => item.userId === userId && item.courseId === courseId)) return res.status(409).json({ error: 'Usuário já está inscrito neste curso.' });
  const enrollment = { id: randomUUID(), userId, courseId, status: 'active', enrolledAt: new Date().toISOString() };
  db.enrollments.push(enrollment);
  await writeDatabase(db);
  res.status(201).json(enrollment);
}));

app.get('/users/:userId/enrollments', asyncHandler(async (req, res) => {
  const db = await readDatabase();
  const enrollments = db.enrollments.filter((item) => item.userId === req.params.userId).map((item) => ({ ...item, course: db.courses.find((course) => course.id === item.courseId) }));
  res.json(enrollments);
}));

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ error: 'Erro interno do servidor.' }); });

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') app.listen(port, '0.0.0.0', () => console.log(`AprendeAí API executando na porta ${port}`));
export default app;
