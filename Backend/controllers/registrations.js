const teacher = require("./../models/teacher_data");
const student = require("./../models/student_data");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid");

exports.registration = async (req, res) => {
  try {
    const username = req.query.username;
    const email = req.query.email;
    const salt = await bcrypt.genSalt(12);
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const hashedPassword = await bcrypt.hash(req.query.password, salt);
    var nano = nanoid();
    const data = new teacher({
      username: username,
      email: email,
      teacher_id: nano,
      password: hashedPassword,
    });
    const teacher_data = await data.save();
    res.status(201).json({
      status: "success",
      message: `teacher created with username ${req.query.username}`,
      username: username,
      email: email,
      teacher_id: nano,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.student_registration = async (req, res) => {
  try {
    const username = req.query.username;
    const email = req.query.email;
    const salt = await bcrypt.genSalt(12);
    const nanoid = customAlphabet("1234567890abcdef", 10);
    const hashedPassword = await bcrypt.hash(req.query.password, salt);
    var nano = nanoid();
    const data = new student({
      username: username,
      email: email,
      student_id: nano,
      password: hashedPassword,
    });
    const _data = await data.save();
    res.status(201).json({
      status: "success",
      message: `teacher created with username ${req.query.username}`,
      username: username,
      email: email,
      student_id: nano,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.teacher_login = async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    return res.json({
      status: "failure",
      message: `please enter email`,
    });
  }
  const pswd = req.query.password;
  if (!pswd) {
    return res.json({
      status: "failure",
      message: `please enter password`,
    });
  }
  var data = await teacher.find({ email: email });
  console.log(data);
  if (data.length == 0) {
    return res.json({
      status: "failure",
      message: `${email} not found, please register`,
    });
  }

  var correct_password = await bcrypt.compare(pswd, data[0].password);
  if (correct_password) {
    var token = jwt.sign(
      {
        username: data[0].username,
        email: data[0].email,
        teacher_id: data[0].teacher_id,
      },
      "qwertop098",
      { expiresIn: "4h" }
    );
    var decoded_values = jwt.decode(token, "qwertop098");
    return res.json({
      status: "success",
      message: "login successful",
      token,
      decoded_values,
    });
  } else {
    return res.json({
      status: "failure",
      message: `invalid password, please try again`,
    });
  }
};

exports.student_login = async (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    return res.json({
      status: "failure",
      message: `please enter email`,
    });
  }
  const pswd = req.query.password;
  if (!pswd) {
    return res.json({
      status: "failure",
      message: `please enter password`,
    });
  }
  var data = await student.find({ email: email });
  if (data.length == 0) {
    return res.json({
      status: "failure",
      message: `${email} not found, please register`,
    });
  }

  var correct_password = await bcrypt.compare(pswd, data[0].password);
  if (correct_password) {
    var token = jwt.sign(
      {
        username: data[0].username,
        email: data[0].email,
        student_id: data[0].student_id,
      },
      "qwertop098",
      { expiresIn: "4h" }
    );
    var decoded_values = jwt.decode(token, "qwertop098");
    return res.json({
      status: "success",
      message: "login successful",
      token,
      decoded_values,
    });
  } else {
    return res.json({
      status: "failure",
      message: `invalid password, please try again`,
    });
  }
};
