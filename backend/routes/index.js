const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../middleware");
const { payWall } = require("../middleware");

const authRoutes = require("./auth");
const twitterAuthRoutes = require("./twitterAuth");
const tweetRoutes = require("./tweet");
const tweetGeneratorRoutes = require("./tweetGenerator");
const userRoutes = require("./user");
const subscriptionRoutes = require("./subscription");
const checkoutRoutes = require("./checkout");
const contactRoutes = require("./contact");
const leadRoutes = require("./lead");
const taskRoutes = require("./task");
const noteRoutes = require("./note");

// @route   /auth/*
// @desc    Routes for authentication
// @access  Public
router.use("/auth", authRoutes);

// @route   /twitter/*
// @desc    Routes for twitter authentication
// @access  Private
router.use("/twitter", protectedRoute, twitterAuthRoutes);

// @route   /tweet/*
// @desc    Routes for tweets
// @access  Private
router.use("/tweet", protectedRoute, payWall, tweetRoutes);

// @route   /tweet-generator/*
// @desc    Routes for tweet generator
// @access  Private
router.use("/tweet-generator", protectedRoute, payWall, tweetGeneratorRoutes);

// @route   /user/*
// @desc    Routes for user
// @access  Private
router.use("/user", protectedRoute, userRoutes);

// @route   /subscription/*
// @desc    Routes for subscription
// @access  Private
router.use("/subscription", protectedRoute, subscriptionRoutes);

// @route   /checkout/*
// @desc    Routes for checkout
// @access  Private
router.use("/checkout", protectedRoute, checkoutRoutes);

// @route   /contact/*
// @desc    Routes for contact
// @access  Private
router.use("/contact", protectedRoute, payWall, contactRoutes);

// @route   /lead/*
// @desc    Routes for lead
// @access  Private
router.use("/lead", protectedRoute, payWall, leadRoutes);

// @route   /task/*
// @desc    Routes for task
// @access  Private
router.use("/task", protectedRoute, payWall, taskRoutes);

// @route   /note/*
// @desc    Routes for note
// @access  Private
router.use("/note", protectedRoute, payWall, noteRoutes);

module.exports = router;
