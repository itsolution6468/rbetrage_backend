const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = new User({
    name: name,
    email: email,
    password: password,
  });

  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    "RANDOM-TOKEN",
    { expiresIn: "24h" }
  );

  res.status(200).json({ token: token });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      );

      res.status(200).json({ token: token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
