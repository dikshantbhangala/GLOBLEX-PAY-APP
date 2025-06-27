const nodeemailer = require('nodeemailer');

class EmailService{
    constructor() {
        this.transporter = nodeemailer.createTransporter({
            host : process.env.SMIP_HOST,
            port: process.env.SMIP_PORT,
            secure: false,
            auth:{
                user: process.env.SMIP_USER,
                pass: process.env.SMIP_PASS
            }
        });
    }
        async sendVerificationEmail(email, token){
            const verificationUrl = `${process.env.FRONTEND_URL}/ verify-email?token=${token}`;

            await this.transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to:email,
            subject:'Verify your email address',
            html: `
            <h1>Email Verification</h1>
            <p> Click the link below to verify your email address:</p>
            <a href ="${verificationUrl}">Verify Email</a>
            <p> this link expires in 24 hours.</p>
            `
        });
    }

    async sendTransactionNotificaton(email, transaction){
        await this.transporter.sendMail({
            from : process.env.sendMail,
            to: email,
            subject: `Transaction ${transaction.status}`,
            html: `
        <h1>Transaction Update</h1>
        <p>Your transaction ${transaction.transactionId} is now ${transaction.status}</p>
        <p>Amount: ${transaction.amount.value} ${transaction.amount.currency}</p>
      `
        });
    }

    async sendPasswordReset(email,token){
        const resetUrl = `${process.env.FRONTEND_URL} /reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to : email,
            subject: 'Password Reset Request',
             html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `
        });
    }

}

module.exports = new EmailService();