const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

require('./helpers/passport')(passport);

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(
  helmet({
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'"]
      }
    },
    dnsPrefetchControl: false
  })
);
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
});

/* app.use((req, res, next) => {
  console.log(req.body);
  next();
}); */

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/page', require('./routes/page'));
app.use('/click', require('./routes/click'));
app.use('/scroll', require('./routes/scroll'));

app.listen(port, () => {
  console.log(`Server is running on port ${port} !!!`);
});
