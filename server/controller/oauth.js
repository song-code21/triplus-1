require('dotenv').config();
const axios = require('axios');
const { google } = require('googleapis');
const { user } = require('../models');
const { generateAccessToken, sendAccessToken, isAuthorized } = require('./functions/user');

module.exports = {
  google: async (req, res) => {
    const accessCode = req.body.authorizationCode;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URL
    );
    const { tokens } = await oauth2Client.getToken(accessCode);
    oauth2Client.setCredentials(tokens);
    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    const { sub, email, picture } = userInfo.data;
    user
      .findOrCreate({
        where: { userId: sub, email: email },
        defaults: { userId: sub, email: email, image: picture },
      })
      .then(([data, created]) => {
        const accessToken = generateAccessToken(data.dataValues);
        sendAccessToken(res, accessToken);
        return res.status(201).json({ success: true, message: '로그인이 완료되었습니다' });
      })
      .catch((err) => console.log(err));
  },
};
