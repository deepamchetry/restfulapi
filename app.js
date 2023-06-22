const express = require('express');
const { connectDB, getDB } = require('./db');

const app = express();
const port = 3000; 
app.use(express.json());

// GET /students
app.get('/students', async (req, res) => {
  try {
    const db = getDB();
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (err) {
    console.error('Failed to fetch students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /students/:id
app.get('/students/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const db = getDB();
    const student = await db.collection('students').findOne({ id });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error('Failed to fetch student:', err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// POST /students
app.post('/students', async (req, res) => {
  const { name, age, grade } = req.body;

  // Validate the data
  if (!name || !age || !grade) {
    res.status(400).json({ error: 'Name, age, and grade are required' });
    return;
  }

  try {
    const db = getDB();
    const result = await db.collection('students').insertOne({ name, age, grade });
    const student = result.ops[0];
    res.status(201).json(student);
  } catch (err) {
    console.error('Failed to create student:', err);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// PUT /students/:id
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const { name, age, grade } = req.body;

  // Validate the data
  if (!name || !age || !grade) {
    res.status(400).json({ error: 'Name, age, and grade are required' });
    return;
  }

  try {
    const db = getDB();
    const result = await db
      .collection('students')
      .findOneAndUpdate({ id }, { $set: { name, age, grade } }, { returnDocument: 'after' });

    if (result.value) {
      res.json(result.value);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error('Failed to update student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE /students/:id
app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const db = getDB();
    const result = await db.collection('students').deleteOne({ id });

    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error('Failed to delete student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
