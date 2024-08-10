import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { handleMakeError } from "../utils/handleMakeError.js";

export const register = async (req, res, next) => {
  const { email, username, password } = req.body;
  // hashed the password first
  const hashedPassword = await bcrypt.hash(password, 10);

  const splitUsername = username.split("")
    if (splitUsername.length <= 5) {
      return next(handleMakeError(400, "Username must atleast 6 letters"))
    } else if (splitUsername.length > 10) {
      return next(handleMakeError(400, "Username must atleast lessthan 10 letters"))
    }
    const joinUsername = splitUsername.join("")


  // validating the email if its valid
  // so spaces between email is not allowed, also number afte @ is not allowed
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;

    // validating to not allow spaces
    if (/\s/.test(username)) {
      return next(handleMakeError(400, "Username cannot contain spaces"));
    }
    // validating to not allow spaces
    if (password && /\s/.test(password)) {
      return next(handleMakeError(400, "Password cannot contain spaces"));
    }

  if (!email || !username || !password)
    return next(handleMakeError(400, "Please input required fields!"));

  if (!emailRegex.test(email))
    return next(handleMakeError(400, "Invalid email address"));

  try {
    const newUser = new User({
      email,
      username: joinUsername,
      password: hashedPassword,
    });
    // generating token andd settign cookie after registration of user
    // successfully registered then they will redirected in homepage as a login user, they dont need to login after registration as they will be automatically a user in site
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  
  // validating to not allow spaces
  if (password && /\s/.test(password)) {
    return next(handleMakeError(400, "Password cannot contain spaces"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(handleMakeError(404, "User not found"));
    // check if password is valid
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword)
      return next(handleMakeError(401, "Invalid Credentials"));
    // generating token and set cookie
    generateTokenAndSetCookie(validUser._id, res);
    // seperating password in the output
    const { password: pass, ...rest } = validUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token")
    res.status(200).json("user has loggedout")
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// first find email in the user and pass in the req.body.email
// if email exist then generate a token
// 

export const googleLogin = async (req, res, next) => {
  
  const {email, username, profilePhoto} = req.body 
  
  try {
    const user = await User.findOne({email})
    if (user) {
      generateTokenAndSetCookie(user._id, res)
      const {password, ...userWithNoPassword} = user._doc
      res.status(200).json(userWithNoPassword)
    } else {
      const generateRandomPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(generateRandomPassword, 10)

      const generateUserName = `${username.replace(/\s+/g, '').toLowerCase()}${Math.random().toString(36).slice(-4)}`;
      // else generate a new user 
      const newUser = new User({
        email,
        username: generateUserName,
        password: hashedPassword, //hashed the password
        profilePhoto,
      })
      // after creating new user then generate a token and cookie for the new user
      await newUser.save()
      generateTokenAndSetCookie(newUser._id, res)
      const {password, ...userWithNoPassword} = newUser._doc
      res.status(200).json(userWithNoPassword)
    }
    
  } catch (error) {
    next(error)
  }
}
