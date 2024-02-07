const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// Create Students table
db.run(`CREATE TABLE IF NOT EXISTS Students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  name TEXT,
  age INTEGER,
  grade TEXT
)`);

// Create Classes table
db.run(`CREATE TABLE IF NOT EXISTS Classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  teacher TEXT
)`);

// Create Courses table
db.run(`CREATE TABLE IF NOT EXISTS Courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  credits INTEGER
)`);

// Create Timetable table
db.run(`CREATE TABLE IF NOT EXISTS Timetable (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  class_id INTEGER,
  course_id INTEGER,
  day TEXT,
  time TEXT,
  FOREIGN KEY (student_id) REFERENCES Students (id),
  FOREIGN KEY (class_id) REFERENCES Classes (id),
  FOREIGN KEY (course_id) REFERENCES Courses (id)
)`);

// Create Grades table
db.run(`CREATE TABLE IF NOT EXISTS Grades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  course_id INTEGER,
  grade TEXT,
  FOREIGN KEY (student_id) REFERENCES Students (id),
  FOREIGN KEY (course_id) REFERENCES Courses (id)
)`);

db.close();
