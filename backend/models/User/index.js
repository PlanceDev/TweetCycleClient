const mongoose = require("mongoose");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const validator = require("mongoose-validator");

const nameValidator = [
  validator({
    validator: "isLength",
    arguments: [2, 50],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validator({
    validator: "isAlphanumeric",
    passIfEmpty: true,
    message: "Name should contain alpha-numeric characters only",
  }),
];

const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email is not valid",
  }),
];

const passwordValidator = [
  validator({
    validator: "isLength",
    arguments: [8, 50],
    message: "Password should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validator({
    validator: "matches",
    arguments: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{3,}$/,
    message:
      "Password should contain at least one uppercase letter, one lowercase letter and one number",
  }),
];

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid.v4,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      minlength: 2,
      nameValidator,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 2,
      nameValidator,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      emailValidator,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      passwordValidator,
      required: true,
    },
    twitterUsername: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      sparse: true,
    },
    twitterId: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      sparse: true,
    },
    twitterAccessToken: {
      type: String,
      trim: true,
      minlength: 3,
      sparse: true,
    },
    twitterAccessTokenSecret: {
      type: String,
      trim: true,
      minlength: 3,
      sparse: true,
    },
    subscription: {
      type: String,
      ref: "Subscription",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// check if user is already in the database
userSchema.statics.register = async function (profile) {
  const { email, pw, firstName, lastName } = profile;

  if ([email, pw, firstName, lastName].some((field) => !field)) {
    const err = new Error("All fields are required");
    err.status = 422;
    err.message = "All fields are required";
    throw err;
  }

  const userExist = await this.findOne({ email: profile.email });

  if (userExist) {
    const err = new Error("User already exists");
    err.status = 409;
    err.message = "User already exists";
    throw err;
  }

  return this.create({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    password: profile.pw,
  });
};

// login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    const err = new Error("Invalid Credentials");
    err.status = 404;
    err.message = "Invalid Credentials";
    throw err;
  }

  if (!user.isEmailVerified) {
    const err = new Error("Email not verified");
    err.status = 401;
    err.message = "Email not verified";
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error("Invalid Credentials");
    err.status = 404;
    err.message = "Invalid Credentials";
    throw err;
  }

  // remove access tokens from the response
  user.accessToken = undefined;
  user.accessSecret = undefined;
  user.__v = undefined;

  return user;
};

// verify user email
userSchema.statics.verifyEmail = async function (owner) {
  const user = await this.findOne({ _id: owner });

  console.log(user);

  if (!user) {
    const err = new Error("Invalid Token");
    err.status = 401;
    err.message = "Invalid Token";
    throw err;
  }

  user.isEmailVerified = true;
  await user.save();

  return user;
};

// reset user password with token sent to email
userSchema.statics.resetPassword = async function (
  user_email,
  password,
  confirmPassword
) {
  if (password !== confirmPassword) {
    const err = new Error("Password could not be reset");
    err.status = 401;
    err.message = "Passwords do not match";
    throw err;
  }

  const user = await this.findOne({ email: user_email });

  if (!user) {
    const err = new Error("Password could not be reset");
    err.status = 401;
    err.message = "Invalid Token";
    throw err;
  }

  user.password = password;
  await user.save();

  return user;
};

exports.User = mongoose.model("User", userSchema);
