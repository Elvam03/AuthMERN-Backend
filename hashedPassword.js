const bcrypt = require("bcryptjs");

const hashedPassword = async () => {
  const password = "adminpassword"; // Change this to your actual password
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
};

hashedPassword();
