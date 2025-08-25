import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("simple-identifier");

    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  } catch (error) {
    console.log("Failed to rate limit", error);
    res.status(500).json({ message: "Failed to rate limit" });
    next();
  }
};

export default ratelimiter;
