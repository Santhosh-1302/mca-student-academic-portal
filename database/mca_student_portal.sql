CREATE DATABASE IF NOT EXISTS mca_student_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mca_student_portal;

CREATE TABLE semesters(id INT AUTO_INCREMENT PRIMARY KEY,semester_no TINYINT NOT NULL UNIQUE);
CREATE TABLE users(
 id INT AUTO_INCREMENT PRIMARY KEY,email VARCHAR(120) NOT NULL UNIQUE,password_hash VARCHAR(255) NOT NULL,
 full_name VARCHAR(120) NOT NULL,role ENUM('student','professor','admin') NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE students(
 id INT AUTO_INCREMENT PRIMARY KEY,user_id INT UNIQUE,register_no VARCHAR(40) NOT NULL UNIQUE,
 email VARCHAR(120) NOT NULL UNIQUE,phone VARCHAR(20),dob DATE,gender VARCHAR(20),
 semester_id INT,section VARCHAR(10),address VARCHAR(255),skills TEXT,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
 FOREIGN KEY(semester_id) REFERENCES semesters(id)
);
CREATE TABLE professors(
 id INT AUTO_INCREMENT PRIMARY KEY,user_id INT UNIQUE,designation VARCHAR(100) NOT NULL,
 department VARCHAR(120) NOT NULL,qualification VARCHAR(150),email VARCHAR(120) UNIQUE,
 subjects_handled TEXT,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE subjects(
 id INT AUTO_INCREMENT PRIMARY KEY,code VARCHAR(30) NOT NULL UNIQUE,name VARCHAR(150) NOT NULL,
 credits DECIMAL(3,1) NOT NULL,semester_id INT,FOREIGN KEY(semester_id) REFERENCES semesters(id)
);
CREATE TABLE syllabus(
 id INT AUTO_INCREMENT PRIMARY KEY,subject_id INT NOT NULL,unit_no TINYINT NOT NULL,topics TEXT NOT NULL,
 UNIQUE(subject_id,unit_no),FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE TABLE study_materials(
 id INT AUTO_INCREMENT PRIMARY KEY,subject_id INT,professor_id INT,title VARCHAR(200) NOT NULL,
 description TEXT,material_type ENUM('PDF','PPT','DOC','Link','Notes','Video') NOT NULL,
 resource_url VARCHAR(500),published_at DATE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
 FOREIGN KEY(professor_id) REFERENCES professors(id) ON DELETE SET NULL
);
CREATE TABLE projects(
 id INT AUTO_INCREMENT PRIMARY KEY,subject_id INT,professor_id INT,title VARCHAR(200) NOT NULL,
 description TEXT,assigned_date DATE,deadline DATE,
 status ENUM('Pending','In Progress','Submitted','Completed','Overdue') DEFAULT 'Pending',
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
 FOREIGN KEY(professor_id) REFERENCES professors(id) ON DELETE SET NULL
);
CREATE TABLE project_submissions(
 id INT AUTO_INCREMENT PRIMARY KEY,project_id INT NOT NULL,student_id INT NOT NULL,
 submission_date DATE,submission_url VARCHAR(500),remarks TEXT,
 status ENUM('Submitted','Reviewed','Rejected') DEFAULT 'Submitted',
 UNIQUE(project_id,student_id),FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
CREATE TABLE laboratory_work(
 id INT AUTO_INCREMENT PRIMARY KEY,subject_id INT,professor_id INT,experiment_no INT NOT NULL,
 experiment_title VARCHAR(200) NOT NULL,experiment_date DATE,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
 FOREIGN KEY(professor_id) REFERENCES professors(id) ON DELETE SET NULL
);
CREATE TABLE lab_progress(
 id INT AUTO_INCREMENT PRIMARY KEY,laboratory_id INT NOT NULL,student_id INT NOT NULL,
 status ENUM('Not Started','In Progress','Completed') DEFAULT 'Not Started',
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE(laboratory_id,student_id),FOREIGN KEY(laboratory_id) REFERENCES laboratory_work(id) ON DELETE CASCADE,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
CREATE TABLE marks(
 id INT AUTO_INCREMENT PRIMARY KEY,student_id INT NOT NULL,subject_id INT NOT NULL,
 internal1 DECIMAL(5,2) DEFAULT 0,internal2 DECIMAL(5,2) DEFAULT 0,assignment DECIMAL(5,2) DEFAULT 0,
 model DECIMAL(5,2) DEFAULT 0,external DECIMAL(5,2) DEFAULT 0,
 total DECIMAL(6,2) GENERATED ALWAYS AS(internal1+internal2+assignment+model+external) STORED,
 UNIQUE(student_id,subject_id),FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE TABLE timetable(
 id INT AUTO_INCREMENT PRIMARY KEY,day_name ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
 day_order TINYINT,period_no TINYINT NOT NULL,start_time TIME NOT NULL,end_time TIME NOT NULL,
 subject_id INT,professor_id INT,room VARCHAR(50),
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
 FOREIGN KEY(professor_id) REFERENCES professors(id) ON DELETE SET NULL
);
CREATE TABLE day_orders(id INT AUTO_INCREMENT PRIMARY KEY,day_date DATE UNIQUE,day_order TINYINT NOT NULL,label VARCHAR(50));
CREATE TABLE announcements(
 id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(200) NOT NULL,description TEXT NOT NULL,posted_by INT,
 priority ENUM('Normal','Important','Urgent') DEFAULT 'Normal',published_at DATE NOT NULL,
 FOREIGN KEY(posted_by) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE events(
 id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(200) NOT NULL,event_type VARCHAR(80) NOT NULL,
 event_date DATE NOT NULL,event_time TIME,venue VARCHAR(150),organizer VARCHAR(150),description TEXT
);
CREATE TABLE notifications(
 id INT AUTO_INCREMENT PRIMARY KEY,user_id INT,message VARCHAR(255) NOT NULL,is_read BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO semesters(semester_no) VALUES(1),(2),(3),(4);
-- Demo only: production authentication must use secure server-side password hashing.
INSERT INTO users(email,password_hash,full_name,role) VALUES
('admin@mca.edu','Admin@123','Portal Administrator','admin'),
('professor@mca.edu','Professor@123','Dr. Priya Kumar','professor'),
('student@mca.edu','Student@123','Santhosh','student');

INSERT INTO students(user_id,register_no,email,phone,dob,gender,semester_id,section,address,skills)
VALUES(3,'MCA2026-001','student@mca.edu','9876543210','2005-02-13','Male',2,'A','Tamil Nadu, India','Java, HTML, CSS, JavaScript, SQL');
INSERT INTO professors(user_id,designation,department,qualification,email,subjects_handled)
VALUES(2,'Assistant Professor','Computer Science','Ph.D.','professor@mca.edu','Web Technologies, Data Analytics, Machine Learning');
INSERT INTO subjects(code,name,credits,semester_id) VALUES
('MCA501','Machine Learning',4,2),('MCA502','Web Technologies',4,2),('MCA503','Data Analytics',4,2),
('MCA504','Research Methodology',3,2),('MCA505','Distributed Systems',4,2),('MCA506','MERN Laboratory',2,2);
INSERT INTO syllabus(subject_id,unit_no,topics) VALUES
(1,1,'Introduction to Machine Learning'),(1,2,'Regression'),(1,3,'Classification'),(1,4,'Clustering'),(1,5,'Neural Networks'),
(2,1,'HTML and CSS'),(2,2,'JavaScript'),(2,3,'Bootstrap'),(2,4,'Web APIs'),(2,5,'Web Application Development'),
(3,1,'Python and NumPy'),(3,2,'Pandas'),(3,3,'Data Cleaning'),(3,4,'Visualization'),(3,5,'Exploratory Analysis');
INSERT INTO study_materials(subject_id,professor_id,title,description,material_type,resource_url,published_at) VALUES
(1,1,'Machine Learning Unit I Notes','Introduction, learning types and basic concepts.','PDF','#','2026-10-05'),
(2,1,'Bootstrap 5 Reference','Responsive components and utilities.','Notes','#','2026-10-03'),
(3,1,'Pandas Data Analysis','DataFrames, filtering and aggregation.','PPT','#','2026-10-01');
INSERT INTO projects(subject_id,professor_id,title,description,assigned_date,deadline,status) VALUES
(2,1,'MCA Student Portal','Build a responsive academic portal.','2026-10-01','2026-10-20','In Progress'),
(1,1,'ML Classification Study','Implement and compare classification algorithms.','2026-09-28','2026-10-15','Pending'),
(3,1,'Data Visualization Report','Create an exploratory data analysis report.','2026-09-20','2026-10-05','Completed');
INSERT INTO laboratory_work(subject_id,professor_id,experiment_no,experiment_title,experiment_date) VALUES
(6,1,1,'Create a React SPA','2026-09-15'),(6,1,2,'Routing and Navigation','2026-09-22'),(3,1,3,'Pandas Data Cleaning','2026-10-08');
INSERT INTO lab_progress(laboratory_id,student_id,status) VALUES(1,1,'Completed'),(2,1,'In Progress'),(3,1,'Not Started');
INSERT INTO marks(student_id,subject_id,internal1,internal2,assignment,model,external) VALUES
(1,1,24,25,9,9,27),(1,2,23,24,10,9,29),(1,3,21,22,9,9,26),(1,4,20,21,8,8,25);
INSERT INTO timetable(day_name,day_order,period_no,start_time,end_time,subject_id,professor_id,room) VALUES
('Monday',1,1,'09:00','10:00',2,1,'MCA-2'),('Monday',1,2,'10:00','11:00',3,1,'MCA Lab'),
('Monday',1,3,'11:15','12:15',1,1,'MCA-2'),('Tuesday',2,1,'09:00','10:00',4,1,'MCA-2'),
('Tuesday',2,2,'10:00','11:00',5,1,'MCA-2'),('Wednesday',3,1,'09:00','10:00',6,1,'MCA Lab');
INSERT INTO day_orders(day_date,day_order,label) VALUES
('2026-10-05',1,'Monday'),('2026-10-06',2,'Tuesday'),('2026-10-07',3,'Wednesday'),
('2026-10-08',4,'Thursday'),('2026-10-09',5,'Friday');
INSERT INTO announcements(title,description,posted_by,priority,published_at) VALUES
('Internal Assessment Schedule','Internal assessment timetable has been published.',1,'Urgent','2026-10-07'),
('Study Material Updated','New Machine Learning notes are available.',2,'Important','2026-10-05'),
('Department Meeting','Faculty and student representatives meeting this Friday.',1,'Normal','2026-10-04');
INSERT INTO events(title,event_type,event_date,event_time,venue,organizer,description) VALUES
('Guest Lecture on AI','Guest Lecture','2026-10-14','10:00:00','MCA Seminar Hall','Department of Computer Science','Guest lecture on current AI trends.'),
('TechX 2026','Symposium','2026-10-20','09:00:00','College Campus','MCA Department','Technical and non-technical symposium.'),
('Placement Training','Placement Training','2026-10-22','14:00:00','Placement Hall','Placement Cell','Aptitude and technical preparation session.');
INSERT INTO notifications(user_id,message) VALUES
(3,'New study material uploaded'),(3,'Project deadline approaching'),(3,'Department seminar on 14 October');
