const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword("Samm2001");
