const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../middleware");

const authRoutes = require("./auth");
const twitterAuthRoutes = require("./twitterAuth");
const tweetRoutes = require("./tweet");

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

module.exports = router;
