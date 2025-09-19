import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient;

const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT);

if (redisHost && !isNaN(redisPort)) {
  redisClient = createClient({
    socket: {
      host: redisHost,
      port: redisPort
    }
  });

  redisClient.on('error', (err) => console.error('Redis connection error:', err));

  redisClient.connect().then(() => console.log('Redis connected'));
} else {
  console.log('Redis not configured. Skipping Redis connection.');
}

export default redisClient;
