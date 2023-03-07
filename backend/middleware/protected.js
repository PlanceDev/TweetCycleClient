const jwt = require("jsonwebtoken");
const axios = require("axios");

async function verifyAccessToken(access_token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

exports.protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send({ message: "No token provided" });
    }

    const access_token = authHeader.split(" ")[1];

    await verifyAccessToken(access_token)
      .then((decoded) => {
        req.user = decoded;
        next();
        return;
      })
      .catch(async (error) => {
        if (error.name === "TokenExpiredError") {
          const refresh_token = req.cookies.refresh_token;

          const decodedUser = jwt.decode(access_token);

          const getNewToken = await axios.post(
            `${process.env.SERVER_URL}/auth/refresh-token`,
            {
              refresh_token,
              decodedUser,
            }
          );

          if (!getNewToken) {
            const error = new Error("Invalid token");
            error.status = 440;
            throw error;
          }

          const newAccessToken = getNewToken.data.accessToken;

          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          res.header("Access-Control-Expose-Headers", "Authorization");
          req.user = jwt.decode(newAccessToken);
          next();
          return verifyAccessToken(newAccessToken);
        }
      });
  } catch (e) {
    console.log(e.message);
    res
      .status(e.response.status || 500)
      .send({ error: "An error has occured trying to authenticate the user" });
  }
};
