import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
    },
});

interface BookingEmailData {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    currentWeight: string;
    targetWeight: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
    const mailOptions = {
        from: `"Lovers Diet Center" <${process.env.SMTP_USER || "noreply@loversdietcenter.ae"}>`,
        to: data.email,
        subject: "Booking Confirmation - Lovers Diet Center",
        html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E91E8C; font-size: 24px; margin: 0;">Lovers Diet Center</h1>
          <p style="color: #666; font-size: 14px; margin-top: 4px;">Together for better life</p>
        </div>
        <div style="background: linear-gradient(135deg, #FFF5F9, #FFFAF0); border-radius: 20px; padding: 30px; border: 1px solid rgba(233,30,140,0.1);">
          <h2 style="color: #333; font-size: 20px; margin-top: 0;">Booking Confirmed! ✓</h2>
          <p style="color: #666;">Dear ${data.name},</p>
          <p style="color: #666;">Your consultation has been booked successfully. Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #999; font-size: 14px;">Date</td><td style="padding: 8px 0; font-weight: 600;">${data.date}</td></tr>
            <tr><td style="padding: 8px 0; color: #999; font-size: 14px;">Time</td><td style="padding: 8px 0; font-weight: 600;">${data.time}</td></tr>
            <tr><td style="padding: 8px 0; color: #999; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-weight: 600;">${data.phone}</td></tr>
          </table>
          <p style="color: #666; font-size: 14px;">If you need to reschedule, please contact us at +971 50 123 4567.</p>
        </div>
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
          © ${new Date().getFullYear()} Lovers Diet Center. All rights reserved.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.log("Email sending failed (SMTP not configured):", error);
        return { success: false, error };
    }
}
