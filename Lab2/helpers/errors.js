export const err = (status, message) => ({ status, message });

export const sendError = (res, e) => {
    if (e && e.status) return res.status(e.status).json({ error: e.message });
    return res.status(500).json({ error: typeof e === 'string' ? e : e.message });
};