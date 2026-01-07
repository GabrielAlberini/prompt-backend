import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ success: false, error: "Demasiadas peticiones, por favor, intentalo luego" })
  }
})

export { limiter }