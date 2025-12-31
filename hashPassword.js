// Password hasher from previous backend project

const bcrypt = require('bcrypt');

const plainPassword = "password"; // Replace with password to hash
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hash);
  }
});