const handleSignIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json("Incorrect form submission");
  }
  db.select("email", "hash")
    .where("email", "=", email)
    .from("login")
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => {
            res.status(404).json("Unable to get user");
          });
      } else {
        res.status(404).json("Wrong credentials");
      }
    })
    .catch((err) => {
      res.status(404).json("Wrong credentials");
    });
};

module.exports = {
  handleSignIn: handleSignIn,
};
