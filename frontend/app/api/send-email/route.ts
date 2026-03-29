import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, orderId, totalAmount, items } = await req.json();

    // Create a test account on Ethereal Email on the fly
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Build the items list HTML
    const itemsHtml = items.map((item: any) => `
      <li style="margin-bottom: 10px;">
        ${item.quantity}x <strong>${item.product.title}</strong><br/>
        Price: ₹${item.product.price.toLocaleString('en-IN')}.00
      </li>
    `).join('');

    const info = await transporter.sendMail({
      from: '"Amazon Clone" <no-reply@amazonclone.abc>',
      to: email || 'customer@example.com',
      subject: `Order Confirmation - Order #${orderId.substring(0,8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f1111;">
          <h2 style="color: #ff9900;">Order Confirmed!</h2>
          <p>Thank you for shopping with us!</p>
          <p>Your order <strong>#${orderId.substring(0,8)}</strong> has been placed successfully and is being processed.</p>
          
          <div style="background-color: #f3f3f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <ul style="padding-left: 20px;">${itemsHtml}</ul>
            <p style="font-size: 18px; border-top: 1px solid #ccc; padding-top: 10px;">
              <strong>Total Amount: ₹${totalAmount.toLocaleString('en-IN')}.00</strong>
            </p>
          </div>
          <p>We'll send you another email when your order ships.</p>
          <p style="font-size: 12px; color: #565959; margin-top: 40px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Mock Email sent! Preview URL: %s", previewUrl);

    return NextResponse.json({ 
      success: true, 
      previewUrl 
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
