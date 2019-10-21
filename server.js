const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(helmet({
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'"]
        }
    },
    dnsPrefetchControl: false
}));

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

app.listen(port, () => {
    console.log(`Server is running on port ${port} !!!`);
});