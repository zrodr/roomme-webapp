const db = require('../database/db')
var bcrypt = require('bcrypt');

const create = (name, password,email, phone_number,gender) => {
    return bcrypt.hash(password, 15)
        .then((hashedPassword) => {
            let baseSQL = "INSERT INTO User(`name`,`email`,`password`,`phone_number`, `gender`)VALUES(?,?,?,?,?);";
            return db.execute(baseSQL,[name, email, hashedPassword,phone_number,gender])
        })
        .then(([results, fields])=>{
            if(results && results.affectedRows){
                return Promise.resolve(results.insertId);
            }else{
                return Promise.resolve(-1);
            }

        })
        .catch((err) => Promise.reject(err));
}

const phoneExists = (phone_number) => {
    return db.execute("SELECT * FROM User WHERE phone_number=?", [phone_number])
        .then(([results, fields])=>{
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => Promise.reject(err));
}

const emailExist = (email) => {
    return db.execute("SELECT * FROM User WHERE email=?", [email])
        .then(([results, fields])=>{
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => Promise.reject(err));
}

const updateUser = (name, password,email, phone_number,gender,id) => {
    return bcrypt.hash(password, 15)
        .then((hashedPassword) => {
            let baseSQL = "UPDATE User SET  name=? , email=? , password=?, phone_number=?, gender=? WHERE id = ?";
            return db.execute(baseSQL,[name, email, hashedPassword,phone_number,gender,id])
        })
        .then(([results, fields])=>{
            if(results && results.affectedRows){
                return Promise.resolve(results.insertId);
            }else{
                return Promise.resolve(-1);
            }

        })
        .catch((err) => Promise.reject(err));
}

module.exports = {
  create, phoneExists, emailExist, updateUser
}