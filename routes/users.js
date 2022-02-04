var express = require('express');
var router = express.Router();
const db = require('../database/db')
const { create, phoneExists, emailExist, updateUser } = require('../models/Users');
var bcrypt = require('bcrypt');


router.post('/register', (req, res, next) => {
  let username = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phone_number = req.body.phone_number;
  let gender = req.body.gender;

  phoneExists(phone_number)
    .then((phoneExist) => {
      if (phoneExist) {
        throw new Error("Registration Failed: Phone already registered");
      } else {
        return emailExist(email)
      }
    })
    .then((emailExist) => {
      if (emailExist) {
        throw new Error("Registration Failed: Email already registered")
      } else {
        return create(username, password, email, phone_number, gender);
      }
    })
    .then((createdUserId) => {
      if (createdUserId < 0) {
        throw new Error("Server Error: user could not be created");
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => {
      res.render('register', { err: err.message })
    });
});

router.post('/login', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  //validate
  let baseSQL = "SELECT id, email , password FROM User WHERE email=?";
  let userId;
  db.execute(baseSQL, [email])
    .then(([results, fields]) => {
      if (results && results.length == 1) {
        let hashedPassword = results[0].password;
        userId = results[0].id;

        return bcrypt.compare(password, hashedPassword);
      } else {
        throw new Error("Invalid username!");
      }
    })
    .then((passwordMatched) => {
      if (passwordMatched) {
        req.session.email = email;
        req.session.userId = userId;

        res.redirect("/");
      } else {
        throw new Error("Invalid password!");
      }
    })
    .catch((err) => {
      res.render('login', { err: err.message })
    })
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.clearCookie('csid');
      res.json({ status: "OK", message: "user is logged out" });
    }
  })
});

router.post('/update', (req, res, next) => {
  let username = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phone_number = req.body.phone_number;
  let gender = req.body.gender;
  let id = req.session.userId;

  phoneExists(phone_number)
      .then((phoneExist) => {
        if (phoneExist) {
          throw new Error("Update Failed: Phone already registered");
        } else {
          return emailExist(email)
        }
      })
      .then((emailExist) => {
        if (emailExist) {
          throw new Error("Update Failed: Email already registered")
        } else {
          return updateUser(username, password, email, phone_number, gender,id);
        }
      })
      .then((createdUserId) => {
        if (createdUserId < 0) {
          throw new Error("Server Error: user could not be Edited");
        } else {
          res.redirect("/");
        }
      })
      .catch((err) => {
        res.render('admin', { err: err.message })
      });
});

module.exports = router;