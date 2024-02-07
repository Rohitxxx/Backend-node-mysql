const sqlite3 = require('sqlite3').verbose();

// Open SQLite database
const db = new sqlite3.Database('database.db');

// Begin transaction
db.serialize(() => {
  db.run('BEGIN TRANSACTION');

  // Insert data into Students table
  db.run(`INSERT INTO Students (username, password, name, age, grade) VALUES (?, ?, ?, ?, ?)`, ['Gahana Gupta', 'password123', 'John Doe', 18, 'A'], function(err) {
    if (err) {
      console.error(err.message);
      db.run('ROLLBACK');
    } else {
      const studentId = this.lastID;

      // Insert multiple classes
      const classes = [
        { name: 'Math', teacher: 'Rajesh Gupta' },
        { name: 'Science', teacher: 'Priya Patel' },
        { name: 'English', teacher: 'Anita Sharma' }
      ];

      classes.forEach((classData) => {
        db.run(`INSERT INTO Classes (name, teacher) VALUES (?, ?)`, [classData.name, classData.teacher], function(err) {
          if (err) {
            console.error(err.message);
            db.run('ROLLBACK');
          } else {
            const classId = this.lastID;
            const courseId = classId
            // Insert data into Timetable table
            db.run(`INSERT INTO Timetable (student_id,class_id, course_id, day, time) VALUES (?,?, ?, ?, ?)`, [1,classId, courseId, 'Monday', '9:00 AM'], function(err) {
              if (err) {
                console.error(err.message);
                db.run('ROLLBACK');
              }
            });
          }
        });
      });

      // Insert multiple courses
      const courses = [
        { name: 'Algebra', credits: 3 },
        { name: 'Biology', credits: 4 },
        { name: 'Literature', credits: 3 }
      ];

      courses.forEach((courseData) => {
        db.run(`INSERT INTO Courses (name, credits) VALUES (?, ?)`, [courseData.name, courseData.credits], function(err) {
          if (err) {
            console.error(err.message);
            db.run('ROLLBACK');
          } else {
            const courseId = this.lastID;

            // Insert data into Grades table
            db.run(`INSERT INTO Grades (student_id, course_id, grade) VALUES (?, ?, ?)`, [studentId, courseId, 'A'], function(err) {
              if (err) {
                console.error(err.message);
                db.run('ROLLBACK');
              }
            });
          }
        });
      });

      // Commit the transaction
      db.run('COMMIT', (err) => {
        if (err) {
          console.error('Error committing transaction:', err.message);
        } else {
          console.log('Transaction committed successfully.');
        }
      });
    }
    db.close((closeErr) => {
        if (closeErr) {
          console.error('Error closing database connection:', closeErr.message);
        } else {
          console.log('Database connection closed successfully.');
        }
      });
  });
});

// Close the database connection
// db.close();
