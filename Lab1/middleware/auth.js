// logged in user
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'You must be logged in to perform this action' });
    }
    next();
};

// logging all requests
const logRequests = (req, res, next) => {
    const body = req.body ? { ...req.body } : {};
    if ('password' in body) body.password = '[REDACTED]';

    console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl} ${JSON.stringify(body)}`);
    next();
};

// how many each URL has been requested
const urlCounts = {};

const countRequests = (req, res, next) => {
    const key = `${req.method} ${req.originalUrl}`;
    urlCounts[key] = (urlCounts[key] || 0) + 1;
    console.log(`${key} has been requested ${urlCounts[key]} time(s)`);
    next();
};