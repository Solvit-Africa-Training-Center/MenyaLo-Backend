import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import { errorLogger, logger } from '../../utils/logger';
import { generateUnsubscribeToken } from '../../utils/helper';
config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = (email: string, name: string, fileName: string, subject: string): void => {
  const token = generateUnsubscribeToken(email);
  const unsubscribeLink = `http://localhost:5001/api/v1/subscribers/unsubscribe?token=${token}`;

  const templatePath = path.join(__dirname, '../../../views', `email-templates/${fileName}.ejs`);

  ejs.renderFile(
    templatePath,
    {
      name: name as string,
      email: email as string,
      unsubscribeLink,
    },
    (err, html) => {
      if (err) {
        return errorLogger(err, 'Error rendering EJS:');
      }

      const mailOptions = {
        from: `MenyaLo <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: subject as string,
        html,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return errorLogger(error, 'Error sending email:');
        }
        logger.info('Email successfully sent.');
      });
    },
  );
};

const sendMailInBulk = (email: string[], fileName: string, subject: string): void => {
  const templatePath = path.join(__dirname, '../../../views', `email-templates/${fileName}.ejs`);

  ejs.renderFile(templatePath, (err, html) => {
    if (err) {
      return errorLogger(err, 'Error rendering EJS:');
    }

    const mailOptions = {
      from: `MenyaLo <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject as string,
      html,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return errorLogger(error, 'Error sending email:');
      }
      logger.info('Email successfully sent.');
    });
  });
};

export { sendMail, sendMailInBulk };
