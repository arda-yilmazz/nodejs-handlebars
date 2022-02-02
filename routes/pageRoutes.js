import { Router } from "express";
import { db } from '../helpers/db.js';

const router = Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM posts ORDER BY created_at ASC', (err, posts) => {
        if (err) throw new Error(err);

        res.render('index', {
            posts,
            style: 'home.css',
            user: req.session["user"],
            title: "Anasayfa",
        });
    });
});

router.get('/hakkinda', (req, res) => {
    res.render('about', {
        style: 'about.css',
        user: req.session["user"],
        title: "Hakkında",
    });
});

router.get('/iletisim', (req, res) => {
    res.render('contact', {
        style: 'contact.css',
        user: req.session["user"],
        title: "İletişim",
    });
});

router.get('/bir-seyler-paylas', (req, res) => {
    
    if (!req.session["user"]) {
        req.session["error"] = 'Giriş yapmalısınız.';
        res.redirect('/giris-yap');
        return;
    }

    res.render('share', {
        style: 'share.css',
        user: req.session["user"],
        title: "Bir şeyler paylaş",
    });
});

router.get('/kayit-ol', (req, res) => {

    if (req.session["user"]) {
        res.redirect('/');
        return;
    }

    res.render('register', {
        style: 'form.css',
        script: true,
        user: req.session["user"],
        error: req.session["error"],
        title: "Kayıt Ol",
    });
});

router.get('/giris-yap', (req, res) => {
    if (req.session["user"]) {
        return res.redirect('/');
    }

    res.render('login', {
        style: 'form.css',
        script: true,
        error: req.session["error"],
        user: req.session["user"],
        title: "Giriş Yap",
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    let like = false;

    db.query('SELECT * FROM posts WHERE post_id = ?', [id], (err, post) => {
        if (err) throw new Error(err);

        if (post.length > 0) {

            res.render('post-detail', {
                post: post[0],
                style: 'post-detail.css',
                user: req.session["user"],
                like,
                title: post[0].post_title,
            });
        }
    });
});

export default router;