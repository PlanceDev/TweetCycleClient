const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../middleware");

const authRoutes = require("./auth");
const twitterAuthRoutes = require("./twitterAuth");
const tweetRoutes = require("./tweet");
const tweetGeneratorRoutes = require("./tweetGenerator");
const userRoutes = require("./user");
const subscriptionRoutes = require("./subscription");
const checkoutRoutes = require("./checkout");

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
router.use("/tweet", protectedRoute, tweetRoutes);

// @route   /tweet-generator/*
// @desc    Routes for tweet generator
// @access  Private
router.use("/tweet-generator", protectedRoute, tweetGeneratorRoutes);

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

module.exports = router;
