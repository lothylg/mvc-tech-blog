const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const routes = require('./routes');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3003;

// Set up sessions
const sess = {
  secret: 'New mask, same task',
  cookie: {
    maxAge: 24* 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
  helpers: helpers
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); 
app.set('layouts', path.join(__dirname, 'layouts')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));
app.use("/images", express.static(path.join(__dirname, "/public/images")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});




