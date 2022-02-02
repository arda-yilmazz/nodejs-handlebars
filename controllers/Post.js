import { db } from '../helpers/db.js';
import { slug } from '../helpers/index.js';

class Post {
    sharePost(req, res) {
        const { title: post_title, content: post_content } = req.body;
    
        const post_id = Math.floor(Math.random() * 1000000);

        if (!req.session["user"]) {
            req.session["error"] = 'Giriş yapmalısınız.';
            res.redirect('/giris-yap');
            return;
        }

        if (!post_title || !post_content) {
            req.session["error"] = 'Lütfen tüm alanları doldurunuz.';
            res.redirect(req.get('referer'));
            return;
        }

        db.query('INSERT INTO posts SET ?', {
            post_id,
            post_title,
            post_content,
            post_author: req.session["user"].username,
            post_slug: slug(post_title),
            created_at: new Date(),
        }, (err, result) => {
            if (err) throw new Error(err);

            res.redirect('/');
        });

    }
}

export default new Post();