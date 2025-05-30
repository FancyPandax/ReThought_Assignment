import * as readline from 'readline';
const Database = require('better-sqlite3');

// Define types for query results
interface Student {
  name: string;
}

interface Teacher {
  teacher_name: string;
}

interface ClassDetails {
  student_name: string;
  teacher_name: string;
}

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to SQLite database
const db = new Database('school.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Student (
    student_id INTEGER,
    name TEXT,
    class_name TEXT
  );
  CREATE TABLE IF NOT EXISTS Teacher (
    teacher_name TEXT,
    class_name TEXT
  );
  CREATE TABLE IF NOT EXISTS Class (
    class_name TEXT,
    teacher TEXT
  );
`);

// Uncomment to insert a sample student
// const insertStudent = db.prepare('INSERT INTO Student (student_id, name, class_name) VALUES (?, ?, ?)');
// insertStudent.run(5, 'Asher', 'Science');

// Prompt user for class name and teacher name
rl.question('Class Name: ', (className) => {
  rl.question('Teacher Name: ', (teacherName) => {
    console.log();

    // Query: All students in a class
    const studentsInClass: Student[] = db.prepare(`
      SELECT Student.name
      FROM Student
      JOIN Class ON Student.class_name = Class.class_name
      WHERE Class.class_name = ?
    `).all(className);

    console.log(`Students in class '${className}':`);
    studentsInClass.forEach(row => {
      console.log(' -', row.name);
    });

    // Query: All students for a teacher
    const studentsForTeacher: Student[] = db.prepare(`
      SELECT Student.name
      FROM Student
      JOIN Class ON Student.class_name = Class.class_name
      JOIN Teacher ON Class.class_name = Teacher.class_name
      WHERE Teacher.teacher_name = ?
    `).all(teacherName);

    console.log(`\nStudents for teacher '${teacherName}':`);
    studentsForTeacher.forEach(row => {
      console.log(' -', row.name);
    });

    // Query: Students in class and teacher info
    const classDetails: ClassDetails[] = db.prepare(`
      SELECT Student.name AS student_name, Teacher.teacher_name AS teacher_name
      FROM Student
      JOIN Class ON Student.class_name = Class.class_name
      JOIN Teacher ON Class.class_name = Teacher.class_name
      WHERE Class.class_name = ?
    `).all(className);

    if (classDetails.length > 0) {
      const teacher = classDetails[0].teacher_name;
      console.log(`\nClass: ${className}, Teacher: ${teacher}`);
      console.log('Students:');
      classDetails.forEach(row => {
        console.log(' -', row.student_name);
      });
    } else {
      console.log(`\nNo data found for class: ${className}`);
    }

    // Clean up
    rl.close();
    db.close();
  });
});
