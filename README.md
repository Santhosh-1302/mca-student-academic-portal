# MCA Student Academic Portal

A responsive academic portal for MCA students, professors and administrators.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Bootstrap 5
- Bootstrap Icons
- MySQL 8

No Java, Spring Boot, Node.js, React, PHP or Python backend is used.

## Architecture

The browser cannot securely connect directly to MySQL using only frontend technologies. Therefore the project deliberately separates:

- Demo Mode: fully functional browser application using JavaScript, demo data and localStorage.
- MySQL Layer: complete relational database schema and sample records in `database/mca_student_portal.sql`.

A production system would require a secure server-side API, but that is intentionally outside this project.

## Run

1. Extract the project.
2. Open `index.html` directly, or use VS Code Live Server.
3. Login using one of the demo accounts.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | student@mca.edu | Student@123 |
| Professor | professor@mca.edu | Professor@123 |
| Admin | admin@mca.edu | Admin@123 |

## MySQL

Open `database/mca_student_portal.sql` in MySQL Workbench and execute it.

## Modules

Student:
Dashboard, Syllabus, Materials, Projects, Laboratory, Marks, Timetable, Day Order, Faculty, Announcements, Events, Profile.

Professor:
Dashboard, Materials, Projects, Laboratory, Marks, Announcements.

Admin:
Dashboard, Students, Professors, Subjects, Syllabus, Materials, Projects, Laboratory, Marks, Timetable, Announcements and Events.

## Demo Mode

Login, profile editing, search, filters and admin record additions/deletions are stored in browser localStorage.

To reset Demo Mode, clear site data/localStorage for the project in the browser.

## Security

The visible demo credentials are for academic demonstration only. A production deployment must use server-side authentication, secure password hashing, authorization and parameterized database access.
