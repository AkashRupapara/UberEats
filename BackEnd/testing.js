
const bcrypt = require("bcrypt")

const password = "mypass123"
const saltRounds = 10
var encPwd;

bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    throw err
  } else {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        throw err
      } else {
        // encPwd = hash
        console.log(hash)
      }
    })
  }
})


// const passwordEnteredByUser = "mypass123"
// const hash = encPwd

// bcrypt.compare(passwordEnteredByUser, encPwd, function(err, isMatch) {
//   if (err) {
//     throw err
//   } else if (!isMatch) {
//     console.log("Password doesn't match!")
//   } else {
//     console.log("Password matches!")
//   }
// })










