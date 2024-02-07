const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;
const db = new sqlite3.Database('database.db');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM Students WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (row) {
      res.json({ message: 'Login successful',user:row });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Register API
app.post('/register', (req, res) => {
  const { username, password, name, age, grade } = req.body;
  
  db.run('INSERT INTO Students (username, password, name, age, grade) VALUES (?, ?, ?, ?, ?)', [username, password, name, age, grade], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Registration successful' });
    }
  });
});

// Register for Classes API
app.post('/register-class', (req, res) => {
  const { studentId, classId } = req.body;
  
  db.run('INSERT INTO StudentClasses (student_id, class_id) VALUES (?, ?)', [studentId, classId], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Class registration successful' });
    }
  });
});

// Manage Course Timetables API
app.get('/timetable/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  db.all(
    `  SELECT Timetable.day, Timetable.time, Courses.name AS course
    FROM Timetable
    INNER JOIN Classes ON Timetable.class_id = Classes.id
    INNER JOIN Courses ON Timetable.course_id = Courses.id
    WHERE Timetable.student_id = ?`,
    [studentId],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(rows);
      }
    }
  );
});

// View Grades API
app.get('/grades/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  
  db.all(
    `SELECT Courses.name AS course, Grades.grade
    FROM Grades
    INNER JOIN Courses ON Grades.course_id = Courses.id
    WHERE Grades.student_id = ?`,
    [studentId],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(rows);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
