const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

module.exports.sendVerificationEmail = async (user, token) => {
  const url = `http://localhost:3000/api/auth/verify/${token}`;
  // await transporter.sendMail({
  //   to: user.email,
  //   subject: 'Verify your email',
  //   html: `Click <a href="${url}">here</a> to verify your email.`,
  // });
  return url;
};
