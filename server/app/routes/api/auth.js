const express = require('express');
const router = express.Router();
const passport = require('passport');

// Bring in Models & Helperspp
const authController = require('../../controllers/auth');
const checkAuth = require('../../middleware/auth');
const config = require('../../core/configs');

router.post('/login', async (req, res) => {
  return authController.login(req, res)
});

router.post('/register', async (req, res) => {
  return authController.register(req, res)
});

// router.post("/verify-email",verifyEmail);

router.post('/verify-email', async (req, res) => {
  return authController.verifyEmail(req, res)
});

router.post('/reset/password', async (req, res) => {
  return authController.resetpassword(req, res)
});

router.get('/reset/password/:token', async (req, res) => {
  return authController.resetpasswordtoken(req, res)
});

router.post('/jwt/verify', checkAuth(), async (req, res) => {
  return authController.verifyJWTToken(req, res)
})

router.post('/user/me', checkAuth(), async (req, res) => {
  return authController.getCurrentActiveUser(req, res)
})

router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }
  ));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: config.app.clientURL,
    failureRedirect: '/api/auth/google/failure'
  })
);

router.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

router.get('/testgoogle', (req, res) => {
  res.send('<a href="/api/auth/google" blank="true">Authenticate with Google</a>');
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}


module.exports = router;
