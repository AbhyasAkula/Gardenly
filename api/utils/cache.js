import { createClient } from "redis";

let redisClient;
let isRedisConnected = false;

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn("Redis disabled");
    redisClient = undefined;
    isRedisConnected = false;
    return false;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: false,
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis connection error:", err);
      isRedisConnected = false;
    });

    redisClient.on("connect", () => {
      console.log("Redis connected successfully.");
      isRedisConnected = true;
    });

    await redisClient.connect();
    return true;
  } catch (err) {
    console.warn("Redis unavailable, continuing without cache");
    console.error("Failed to connect to Redis:", err);
    redisClient = undefined;
    isRedisConnected = false;
    return false;
  }
};

export const getRedisClient = () => redisClient;

export const cacheMiddleware = (keyPrefix, expiration = 3600) => {
  return async (req, res, next) => {
    if (!isRedisConnected) {
      console.log("Redis is not connected, skipping cache for:", req.originalUrl);
      return next();
    }

    try {
      // Append user ID to cache key if user is authenticated (to avoid leaking private data)
      const userSuffix = req.user && req.user.id ? `:user:${req.user.id}` : '';
      const cacheKey = `${keyPrefix}:${req.originalUrl}${userSuffix}`;
      
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log(`🟢 REDIS CACHE HIT for key: ${cacheKey}`);
        res.setHeader('X-Redis-Cache', 'HIT');
        return res.status(200).json(JSON.parse(cachedData));
      }

      console.log(`🔴 REDIS CACHE MISS for key: ${cacheKey}`);
      res.setHeader('X-Redis-Cache', 'MISS');
      
      // Override res.json to intercept the response and cache it
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(cacheKey, expiration, JSON.stringify(body)).catch(err => {
            console.error("Redis set error:", err);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Redis cache middleware error:", err);
      next(); // Fail gracefully
    }
  };
};

export const clearCache = async (keyPrefix) => {
  if (!isRedisConnected) return;

  try {
    const keys = await redisClient.keys(`${keyPrefix}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared cache for keys starting with: ${keyPrefix}`);
    }
  } catch (err) {
    console.error("Redis clearCache error:", err);
  }
};
