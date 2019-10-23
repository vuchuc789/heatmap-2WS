// Index controller
exports.homePage = (req, res) => {
    res.render('index');
};

exports.dashboard = (req, res) => {
    res.render('index', {
        page: 'dashboard',
        username: req.user.username
    });
};