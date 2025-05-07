"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var Database = require('better-sqlite3');
// Setup readline interface for user input
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Connect to SQLite database
var db = new Database('school.db');
// Create tables
db.exec("\n  CREATE TABLE IF NOT EXISTS Student (\n    student_id INTEGER,\n    name TEXT,\n    class_name TEXT\n  );\n  CREATE TABLE IF NOT EXISTS Teacher (\n    teacher_name TEXT,\n    class_name TEXT\n  );\n  CREATE TABLE IF NOT EXISTS Class (\n    class_name TEXT,\n    teacher TEXT\n  );\n");
// Uncomment to insert a sample student
// const insertStudent = db.prepare('INSERT INTO Student (student_id, name, class_name) VALUES (?, ?, ?)');
// insertStudent.run(5, 'Asher', 'Science');
// Prompt user for class name and teacher name
rl.question('Class Name: ', function (className) {
    rl.question('Teacher Name: ', function (teacherName) {
        console.log();
        // Query: All students in a class
        var studentsInClass = db.prepare("\n      SELECT Student.name\n      FROM Student\n      JOIN Class ON Student.class_name = Class.class_name\n      WHERE Class.class_name = ?\n    ").all(className);
        console.log("Students in class '".concat(className, "':"));
        studentsInClass.forEach(function (row) {
            console.log(' -', row.name);
        });
        // Query: All students for a teacher
        var studentsForTeacher = db.prepare("\n      SELECT Student.name\n      FROM Student\n      JOIN Class ON Student.class_name = Class.class_name\n      JOIN Teacher ON Class.class_name = Teacher.class_name\n      WHERE Teacher.teacher_name = ?\n    ").all(teacherName);
        console.log("\nStudents for teacher '".concat(teacherName, "':"));
        studentsForTeacher.forEach(function (row) {
            console.log(' -', row.name);
        });
        // Query: Students in class and teacher info
        var classDetails = db.prepare("\n      SELECT Student.name AS student_name, Teacher.teacher_name AS teacher_name\n      FROM Student\n      JOIN Class ON Student.class_name = Class.class_name\n      JOIN Teacher ON Class.class_name = Teacher.class_name\n      WHERE Class.class_name = ?\n    ").all(className);
        if (classDetails.length > 0) {
            var teacher = classDetails[0].teacher_name;
            console.log("\nClass: ".concat(className, ", Teacher: ").concat(teacher));
            console.log('Students:');
            classDetails.forEach(function (row) {
                console.log(' -', row.student_name);
            });
        }
        else {
            console.log("\nNo data found for class: ".concat(className));
        }
        // Clean up
        rl.close();
        db.close();
    });
});
