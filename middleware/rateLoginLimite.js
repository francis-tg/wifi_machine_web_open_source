const Redis = require("ioredis");
const redisClient = new Redis({enableOfflineQueue: false});
const rateLimiterRedis = new R({
  storeClient: redisClient,
  points: 10, // Number of points
  duration: 1 // Per second
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiterRedis
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch((_) => {
      res.status(429).send("Too Many Requests");
    });
};

module.exports = rateLimiterMiddleware;
