const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const User = require("../../models/User");
require("dotenv").config();

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

exports.signUp = async (req, res) => {
  const { name, email, uid } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = new User({
    name: name,
    email: email,
    uid: uid,
  });

  await user.save();

  const token = generateToken(user);

  res.status(200).json({ token: token });
};

exports.signIn = async (req, res) => {
  const { email } = req.user;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { user_id, picture, name, email } = req.user;
  const user = await User.findOne({ email });

  if (!user) {
    const newUser = new User({
      name: name,
      email: email,
      googleId: user_id,
      avatar: picture,
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(200).json({ token: token });
  } else {
    const token = generateToken(user);

    res.status(200).json({ token: token });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const code = generateCode();
    user.resetPasswordToken = code;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const msg = {
      to: user.email,
      from: process.env.SENDER_EMAIL,
      subject: "Password Reset Code",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                  Your password reset code is:\n\n
                  ${code}\n\n
                  This code will expire in one hour.\n
                  If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send(msg);
    res.status(200).send("Recovery code sent");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send("Verification code is invalid or has expired.");
    }

    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset code is invalid or has expired.");
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(200).send("Password has been reset.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).send("User ID is required");
    }

    const user = await User.findOne({ _id: id });

    if (user) {
      return res.status(200).send({ user: user });
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
