import express from 'express';
import { engine } from 'express-handlebars';
import moment from 'moment';
import 'moment/locale/tr.js';
import session from 'express-session';
import MysqlStore from 'express-mysql-session';
import 'dotenv/config'

import { db } from './helpers/db.js';
import pageRoutes from './routes/pageRoutes.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

const mysqlStore = MysqlStore(session);

export const sessionStore = new mysqlStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(session({
    name: 'session',
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    unset: 'destroy',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    },
    store: sessionStore,
}));

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/post', postRoutes);

app.set('view engine', 'hbs');
app.engine('hbs', engine({
    helpers: {
        formatDate: (date) => {
            moment.locale('tr');
            return moment(date).format('LL');
        },
        isLike: (like) => !like ? 'Beğen' : 'Beğenmekten vazgeç',
    }
}));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

