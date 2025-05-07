#purpose this this make a db file named school.db ask the user for a class name and Teacher name make tables Students, Teachers, Classes, Run Querys and print the results save and close the database

import sqlite3


db = sqlite3.connect("school.db")
curr = db.cursor()



# remove comment to add student in following format
#curr.execute('INSERT INTO Student (student_id, name, class_name) VALUES (?, ?, ?)', (5, 'Asher', 'Science'))
#====================================================
#tables made here



# Ask user for class and teacher name
class_id = input("Class Name: ")
teacher_name = input("Teacher Name: ")

# Create Student table
curr.execute('''
CREATE TABLE IF NOT EXISTS Student (
    student_id INTEGER,
    name TEXT,
    class_name TEXT
)
''')

# Create Teacher table
curr.execute('''
CREATE TABLE IF NOT EXISTS Teacher (
    teacher_name TEXT,
    class_name TEXT
)
''')

# Create Class table
curr.execute('''
CREATE TABLE IF NOT EXISTS Class (
    class_name TEXT,
    teacher TEXT
)
''')

#=============================================================================
#querys


# All students in a class
curr.execute('''
SELECT Student.name
FROM Student
JOIN Class ON Student.class_name = Class.class_name
WHERE Class.class_name = ?
''', (class_id,))

print(f"\nStudents in class '{class_id}':")
for row in curr.fetchall():
    print(" -", row[0])

# All students for a teacher
curr.execute('''
SELECT Student.name
FROM Student
JOIN Class ON Student.class_name = Class.class_name
JOIN Teacher ON Class.class_name = Teacher.class_name
WHERE Teacher.teacher_name = ?
''', (teacher_name,))

print(f"\nStudents for teacher '{teacher_name}':")
for row in curr.fetchall():
    print(" -", row[0])

# All students in a class with the teacher
curr.execute('''
SELECT Student.name, Teacher.teacher_name
FROM Student
JOIN Class ON Student.class_name = Class.class_name
JOIN Teacher ON Class.class_name = Teacher.class_name
WHERE Class.class_name = ?
''', (class_id,))

results = curr.fetchall()
if results:
    teacher = results[0][1]
    print(f"\nClass: {class_id}, Teacher: {teacher}")
    print("Students:")
    for row in results:
        print(" -", row[0])
else:
    print(f"\nNo data found for class: {class_id}")




db.commit()
db.close()
