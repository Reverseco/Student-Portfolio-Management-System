const express = require("express");
var db = require("../database/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const transport = require("../mailer/mailsend");
const JWT_SECRET = "parwez";
const CryptoJS = require("crypto-js");
const key = "12345";


var enroll_no;

var Name;

var city;
var email;
var mobNo;
var occ;
var dob;
var pass = "hello";
var dept;
var sem;

//route 1
//register user


var crypt = {
  // (B1) THE SECRET KEY
  secret: "CIPHERKEY",

  // (B2) ENCRYPT
  encrypt: (clear) => {
    var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    return cipher.toString();
  },

  // (B3) DECRYPT
  decrypt: (cipher) => {
    var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    return decipher.toString(CryptoJS.enc.Utf8);
  },
};




// router.get("/register_comp", async (req, res, next) => {
//   res.render("register_comp");
// });





router.get("/register", async (req, res, next) => {
  res.render("register", { message: req.flash("message") });
});

router.post("/register", async (req, res, next) => {
  enroll_no = req.body.id;
  Name = req.body.fullName;
  email = req.body.email;
  console.log(enroll_no)
  console.log(email)


  const secret = JWT_SECRET + Name;
  const payload = {
    id: enroll_no,
    email: email,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:80/api/registerauth/register_comp/${enroll_no}/${email}/${token}`;
  // console.log(token);
  var mailOptions = {
    from: "projectaaupy@gmail.com",
    to: `"${email}"`,
    subject: "confirm regiter",
    text: `"confirm register link ===>${link}"`,
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("invalid email");
      console.log(error);
      res.render("login");
    } else {
      console.log("email has been sent", info.response);
      req.flash("message", "Check Your Mail to confirm register");
      res.render("login");
    }
  });


});

// setting the new password

//route 2

router.get("/confirm_register/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
  // console.log(token);

  //  console.log(id);
  if (id != enroll_no) {
    res.send("invalid");
    return;
  }

  const secret = JWT_SECRET + pass;

  try {
    const payload = jwt.verify(token, secret);
    res.render("confirm_register", { id: id, token: token });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

// render the complete register page with id and email in link
router.get("/register_comp/:id/:email/:token", async (req, res, next) => {
  const { id, email, token } = req.params;
  // console.log(token);

  //  console.log(id);
  if (id != enroll_no) {
    res.send("invalid");
    return;
  }

  const secret = JWT_SECRET + Name;

  try {
    const payload = jwt.verify(token, secret);
    res.render("register_comp", { id: id, email: email, token: token });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});


router.post("/register_comp/:id/:email/:token", async (req, res, next) => {
  const id = req.params.id;
  const email = req.params.email;
  const token = req.params.token;

  const secret = JWT_SECRET + Name;
  try {
    //passwrod and confirm password should match
    // here we can simply find the user with the payload and finally update the passwrod
    //always hash the password;
    const payload = jwt.verify(token, secret);

    enroll_no = id;
    city = req.body.address
    mobNo = req.body.mobileno
    dob = req.body.dob
    cipher = crypt.encrypt(req.body.pass)
    var prog = req.body.program;
    dept = req.body.dept
    var year = req.body.year
    sem = req.body.Semester

    // var sql = `INSERT INTO student_data VALUES ("${city}", "${email}" ,  "${mobNo}" , "${occ}" , '${dob}' , "${cipher}", "${Name}","${enroll_no}" ,"${sem}", "${dept}" );`;
    var sql = `insert into student_data values ("${enroll_no}", "${Name}", "${city}", "${email}", "${mobNo}", '${dob}', "${cipher}", "${prog}", "${dept}", "${year}", "${sem}");`;
    db.query(sql, function (err, result) {
      if (err) {
        console.log(err)
        res.redirect("register_comp");
      } else {

        var sql = `insert into links values ("${enroll_no}", "","","","", "");`
        db.query(sql, function (err, result) {
          if (err) {
            console.log(err)
            res.redirect("register_comp")
          } else {

            var sql = `insert into description values ("${enroll_no}", "");`;
            db.query(sql, function (err, result) {
              if (err) {
                console.log(err)
                res.redirect("register_comp");
              } else {

                console.log("Row has been updated");
                req.flash("message", "seccessfully registered");
                res.render("login");

              }
            });

          }
        });

      }
    });

  } catch (error) {
    console.log("ppask")
    console.log(error.message);
    res.send(error.message);
  }
});

module.exports = router;
