const bcrypt 	= require("bcryptjs");
const jwt 		= require("jsonwebtoken");

const { NotFoundError } = require("../helpers/utility");
const config 	= require("../config/config");

const UserModel = require("../models/user.model");

// Reusable response helper
const sendResponse = (res, success, message, data = [], status = 200) => {
  return res.status(status).json({ success, message, data });
};

// Generate JWT
const generateToken = (user, rememberMe = true) => {
  const expiresIn = rememberMe ? config.REMTOKEN_EXPIRY : config.TOKEN_EXPIRY;
  return {
    token: jwt.sign(
      { id: user.id, email: user.email, name: user.name, permissions:user.permissions, rolename:user.rolename },
      config.TOKEN_SECRET,
      { expiresIn }
    ),
    expiresIn,
  };
};

//  LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.getUserByEmail(email);   
    if (!user) {
      return sendResponse(res, false, "Unauthorized: User does not exist", [], 400);
    } 

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return sendResponse(res, false, "Unauthorized: Incorrect password", [], 400);
    }

    const { token, expiresIn } = generateToken(user);

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      permissions: user.permissions,
      rolename:user.rolename,
      token,
      expTime: expiresIn,
    };

    return sendResponse(res, true, "Login successful", [data]);
  } catch (error) {
    console.error("Login Error:", error.message);
    return next(error);
  }
};

//  CHECK TOKEN
exports.checkToken = async (req, res) => {
  return req.user?.id
    ? sendResponse(res, true, "User exists", [req.user])
    : sendResponse(res, false, "No data found", [], 400);
};

//  GET USER BY ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.getUserById(id);

    if (!user) {
      return sendResponse(res, false, "No data found", [], 400);
    }

    return sendResponse(res, true, "User details", [user]);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return sendResponse(res, false, "Error fetching user", [], 500);
    }
    return next(err);
  }
}; 