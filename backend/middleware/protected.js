const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the token from the header, query string, or request body
    if (!req.headers.cookie) {
      return res.status(403).send({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    const token =
      req.headers.cookie.split("=")[1] ||
      req.headers["x-access-token"] ||
      req.query.token ||
      req.body.token ||
      req.headers.authorization;

    // Check if a token was provided
    if (!token) {
      return res.status(403).send({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).send({
          error: "Unauthorized",
          message: "Invalid token",
        });
      }

      // If the token is valid, save the decoded token to the request object
      req.user = decoded;

      next();
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: "An error has occured trying to authenticate the user" });
  }
};
