// middleware/apiKeyAuth.js
import dotenv from 'dotenv'

const apiKeyAuth = (req, res, next) => {
  const userApiKey = req.headers['x-api-key']; // or from query/body if needed

  if (userApiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "Invalid or missing API key" });
  }

  next(); // valid key, continue to the actual route
};

export default apiKeyAuth;
