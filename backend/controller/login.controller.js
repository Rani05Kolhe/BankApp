require("dotenv").config();
const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = {
      email,
    };
    const dbRes = await dbService.findOneRecord(query, schema);
    if (dbRes) {
      const isMatch = await bcrypt.compare(password, dbRes.password);
      if (isMatch) {
        if (dbRes.isActive) {
         delete dbRes._doc.password;
         const payload= {
            ...dbRes._doc,
            _id : dbRes._id.toString()
         }
         const token = await jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "3h"}
         )

          return res.status(200).json({
            message: "Data Found !",
            isLoged: true,
            token, 
            userType:dbRes._doc.userType
          });
        } else {
          return res.status(401).json({
          message: "You are not active member!",
          isLoged: false
        });
        }
      }else{
        return res.status(401).json({
          message: "Invalid credencials !",
          isLoged: false,
        });
      } 
    }
  } catch {
    return res.status(500).json({
      message: "Internal server error",
      isLoged: false,
      error,
    });
  }
};

module.exports = { loginFunc };

// else {
//         return res.status(200).json({
//           message: "Data Found !",
//           isLogged: true,
//         });
//       }
//     } else {
//       return res.status(401).json({
//         message: "Invalid credencials !",
//         isLogged: false,
//       });