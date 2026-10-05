export const err = (status, message) => ({ status, message });

export const sendError = (res, e) => {
    if (e && Number.isInteger(e.status)) {
        return res.status(e.status).json({ error: e.message });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
};