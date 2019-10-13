const path = require('path');

exports.login = (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'login.html'));
};

exports.register = (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'register.html'));
};