const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
    res.render('user/signup')
};

module.exports.signUp = async (req, res) => {
    const { email, username, password } = req.body;
    const newUser = new User({
        email: email,
        username: username,
    });
    try{
        await User.register(newUser, password);
        req.logIn(newUser, (err) => {
            if(err){
                next(err);
            }
        res.redirect('/listings');
        });
    }
    catch(e){
        req.flash('error', 'Error while adding user!');
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}

module.exports.login = function(req, res) {
    req.flash('success', 'Login scucessful!');  
    const redirectUrl = res.locals.returnTo || '/listings';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        new Error(err);
    });
    req.flash('Successfully logged out.');
    res.redirect('/listings');
}