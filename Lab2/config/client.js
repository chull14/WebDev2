import redis from 'redis';

const url = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url });

client.on('error', function (e) {
    console.error('Redis error:', e.message);
});

export default client;