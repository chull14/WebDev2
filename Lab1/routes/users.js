import { Router } from 'express';
import { signUp, loginUser } from '../data/users.js';
import { checkString, checkUsername, checkPassword } from '../helpers/validators.js';
import { sendError } from '../helpers/errors.js';

const router = Router();

// POST /signup
router.post('/signup', async function (req, res) {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Must provide a name, username, and password' });
    };

    let name, username, password;
    try {
        ({ name, username, password } = body);
        name = checkString(name);
        username = checkUsername(username);
        password = checkPassword(password);
    } catch (e) {
        return sendError(res, e);
    }

    try {
        const newUser = await signUp(name, username, password);
        return res.status(200).json(newUser);
    } catch (e) {
        return sendError(res, e);
    }
});

// POST /login
router.post('/login', async function (req, res) {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Must provide a username and password' });
    };

    let username, password;
    try {
        ({ username, password } = body);
        username = checkUsername(username);
        password = checkPassword(password);
    } catch (e) {
        return sendError(res, e);
    }

    try {
        const user = await loginUser(username, password);
        req.session.user = { _id: user._id, username: user.username };
        return res.status(200).json(user);
    } catch (e) {
        return sendError(res, e);
    }
});

// GET /logout
router.get('/logout', async function (req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: 'You are not logged in' });
    }

    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Failed to log out' });
        res.clearCookie('RecipeSesh');
        return res.status(200).json({ message: 'You have been logged out' });
    });
})

export default router;
