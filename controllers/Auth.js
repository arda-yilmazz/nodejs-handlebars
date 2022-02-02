import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../helpers/db.js";
import { sessionStore } from '../index.js';

class Auth {
    async register(req, res) {
        const { username, password: user_password, repassword, email: user_email, name: user_display_name, surname: user_surname } = req.body;

        const user_id = Math.floor(Math.random() * 1000000)

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt)

        if (user_password !== repassword) {
            res.send({
                error: "Şifreler uyuşmuyor"
            });
        }

        db.query('SELECT * FROM users WHERE username = ? OR user_email = ?', [username, user_email], (err, result) => {
            if (err) throw new Error(err);

            if (result.length > 0) {
                req.session["error"] = 'Bu bilgilere sahip bir kullanıcı bulunmaktadır.';
                res.redirect(req.get('referer'));
                return;
            }

            db.query('INSERT INTO users SET ?', {
                user_id,
                username: username.toLowerCase(),
                user_password: hashedPassword,
                user_email: user_email.toLowerCase(),
                user_display_name,
                user_surname,
                created_at: new Date()
            }, (err, result) => {
                if (err) throw new Error(err);

                res.redirect('/');
            });

        });
    }

    login(req, res) {
        const { username, password, token } = req.body;

        db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
            if (err) throw new Error(err);

            if (result.length > 0) {
                const user = result[0];

                bcrypt.compare(password, user.user_password, (err, isMatch) => {
                    if (err) throw new Error(err);

                    if (isMatch) {
                        const token = jwt.sign({
                            user_id: user.user_id,
                        }, 'secret');

                        req.session["user"] = user;
                        req.session["token"] = token;
                        req.session["session_id"] = req.sessionID;

                        res.redirect('/');

                    } else {
                        req.session["error"] = "Kullanıcı adı veya şifre hatalı.";
                        res.redirect(req.get('referer'));
                    }
                });
            } else {
                req.session["error"] = "Kullanıcı adı veya şifre hatalı.";
                res.redirect(req.get('referer'));
            }
        });
    }

    logout(req, res) {
        req.session.destroy(err => {
            if (err) throw new Error(err);

            sessionStore.close();
            res.clearCookie(process.env.SESS_SECRET);
            res.redirect('/');
        });
    }
}

export default new Auth();