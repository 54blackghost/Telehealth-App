import { createTransport } from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  })

  //defining email option and structure

  const mailOptions = {
    from: `"{HOST Name}" <{HOST Email} >`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;