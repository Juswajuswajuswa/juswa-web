import { handleMakeError } from "../utils/handleMakeError.js";
import bcrypt from "bcrypt";
import User from "../models/User.model.js";

export const updateUser = async (req, res, next) => {
  const tokenUserId = req.user.id;
  const id = req.params.id;

  console.log(tokenUserId)

  try {
    if (tokenUserId !== id) {
      return next(handleMakeError(404, "Not Authorized to update this account"));
    }

    const { email, username, password, profilePhoto } = req.body;

    if (!username) return next(handleMakeError(400, "Please input required fields!"));

    //
    // in this block of codes i want to validate if the length of username is less than or equal to 5 then throw an error
    // i split the username into array
    // then join them back after validating, if true throw an error else join them then put as new value in username
    const splitUsername = username.split("")
    if (splitUsername.length <= 5) {
      return next(handleMakeError(400, "Username must atleast 6 letters"))
    } else if (splitUsername.length > 10) {
      return next(handleMakeError(400, "Username must atleast lessthan 10 letters"))
    }
    const joinUsername = splitUsername.join("")
    ////////

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email))
      return next(handleMakeError(400, "Invalid email address"));

    // validating to not allow spaces
    if (/\s/.test(username)) {
      return next(handleMakeError(400, "Username cannot contain spaces"));
    }
    // validating to not allow spaces
    if (password && /\s/.test(password)) {
      return next(handleMakeError(400, "Password cannot contain spaces"));
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          email,
          username: joinUsername,
          password: hashedPassword,
          profilePhoto,
        },
      },
      { new: true }
    ).select("-password"); //deleting the password in the output so it wont show to public, not even you

    res.status(201).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async(req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}