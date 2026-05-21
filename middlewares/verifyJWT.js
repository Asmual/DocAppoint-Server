const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access: Login required",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Forbidden access: Invalid or expired token",
        });
      }

      req.decoded = decoded;

      next();
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "JWT verification failed",
    });
  }
};

module.exports = verifyJWT;