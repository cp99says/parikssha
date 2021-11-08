const app = require("express")();
const registration = require("./../controllers/registrations");

app.route("/teacher/register").post(registration.registration);
app.route("/student/register").post(registration.student_registration);
app.route("/teacher/login").post(registration.teacher_login);
app.route("/student/login").post(registration.student_login);

module.exports = app;
