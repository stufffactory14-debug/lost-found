import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded.id; // make sure this matches login token payload

      next();
    } catch (error) {
      console.log("Token error:", error.message);
      res.status(401).json("Invalid token");
    }
  } else {
    res.status(401).json("No token provided");
  }
};