const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require("jsonwebtoken"); 

const registerController = async (req,res) => {
  try {
    const { name, username, password } = req.body;
    //validation
    if(!name) {
      return res.send({message: "Name is Required"})//name section is blank then display to the user name is required
    }
    if(!username) {
      return res.send({message: "username is Required"})
    }
    if(!password) {
      return res.send({message: "Password is Required"})
    }
  
    //check user
    const existingUser = await userModel.findOne({ username })
    //existing user
    if(existingUser) {
      return res.status(200).send({
        success:false,
        message: "Already Registered Please login"
      })
    }
    //register user
    const hashedPassword = await hashPassword(password)
    //save
    const user = await new userModel({name, username,  password:hashedPassword}).save(); //I forget to write the await here so tha my entered user details not displayed i my vs code terminal
    res.status(201).send({
      success:true,
      message : "User Registered Successfully",
      user
    })
  } catch(error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message: "Error in Registration",
      error,
    })
  }
  
}

//Login, this will show in the testing
//http://localhost:8080/api/v1/auth/login
const loginController = async(req, res)=> {
  try {
    const { username, password } = req.body;
    //validation
    if (!username || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    //check user
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "username is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        adddress: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController, for forgot password you will get OTP that is a paid so I have used question over here
const forgotPasswordController = async (req, res) => {
  try {
    const { username, answer, newPassword } = req.body;
    if(!username) {
      res.status(400).send({ message : "username is required" })
    }
    if(!answer) {
      res.status(400).send({ message : "Answer is required" })
    }
    if(!newPassword) {
      res.status(400).send({ message : "New Password is required" })
    }
    //check
    const user = await userModel.findOne({ username, answer})
    //validation
    if(!user) {
      return res.status(404).send({
        success:false,
        message:"Wrong username or Answer"
      })
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password:hashed });
    res.status(200).send({
      success:true,
      message: "Password Reset Successfully"
    })
  }
  catch(error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      })
    }
  }



module.exports = {registerController, loginController,  forgotPasswordController}; 

//name : name  || user.name => if you get the name then update the name otherwise keep as it is.
//-photo ; deselecting photo
// .sort({createdAt:"-1"}) //latest order will appear first