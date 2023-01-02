const UserModel = require("../models/UserModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;



let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/

let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/



module.exports.createUser = async function (req, res) {
    try {
        let data = req.body
        let { name, email, password} = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ Status: false, message: "Please provide all the details" })
        }
        if (!name || name == "") {
            return res.status(400).send({ Status: false, message: "Please provide name" })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ Status: false, message: "Please enter valid email" })
        }
        if (email) {
            let checkemail = await UserModel.findOne({ email: email }) 

            if (checkemail) {
                return res.status(400).send({ Status: false, message: "Please provide user email, this email has been used " })
            }
        }

        if (!passwordRegex.test(password)) {
          return res.status(400).send({ Status: false, message: "Please provide valid AlphaNumeric password having min character 8 " })
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, salt);

        let obj = {
          name,
          email,
          password: hashPassword,
      };
        let savedData = await UserModel.create(obj)
        return res.status(201).send({ status : true, msg: savedData })
        
  }
  catch (error) {
    res.status(500).send({ status: false, error: error.message })
  }
}






module.exports.login = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || email == "")
      return res.status(400).send({ Status: false, message: "You have to provide email to login " })

    if (!password || password == "")
      return res.status(400).send({ Status: false, message: "You have to provide password to login" })

    let user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ status: false, msg: "User not found or Email Id is invalid" });

    let matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) return res.status(401).send({ status: false, msg: "Password is incorrect." });

    let token = jwt.sign(
      {
        userId: user._id
      },
      process.env.SECRET_KEY
    );

    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, msg: "User login successful", token: token });

  }
  catch (error) {
    res.status(500).send({ status: false, error: error.message })
  }
}





module.exports.getUser = async function (req, res) {
  try {
      let userFound = await UserModel.find(req.query);

          res.status(200).send({ status: true, message: userFound });

  } catch (error) {
      res.status(500).send({ status: false, error: error.message })
  }
}





