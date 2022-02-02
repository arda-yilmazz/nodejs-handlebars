import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const token = req.body["token"];

    if (!token) return res.status(401).send("Bir token giriniz!");

    try {
        const verified = jwt.verify(token, 'secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({
            error: "Geçersiz Token!"
        });
    }
}