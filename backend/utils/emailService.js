const nodemailer = require('nodemailer');

// Configure your email transport
// In a real application, these should be in an .env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dummymail2003s@gmail.com',
        pass: 'uevludqlpergxtje'
    }
});

const sendWelcomeEmail = async (sellerData) => {
    const { name, email } = sellerData;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
            .header { background: #0f172a; padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px; }
            .header h1 span { color: #ffc000; }
            .content { padding: 40px; background: #ffffff; }
            .welcome-text { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
            .features { margin: 30px 0; padding: 0; list-style: none; }
            .feature-item { margin-bottom: 15px; display: flex; align-items: center; }
            .feature-icon { color: #ffc000; margin-right: 15px; font-size: 20px; }
            .cta-button { display: inline-block; padding: 16px 32px; background: #ffc000; color: #000000; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DRIVE <span>DEAL</span></h1>
            </div>
            <div class="content">
                <div class="welcome-text">Welcome to the Marketplace, ${name}!</div>
                <p>We are thrilled to have you on board. Your application to join the DRIVE DEAL Seller Network has been received and is currently under review by our administration team.</p>
                
                <p>While we verify your details, here's what you can look forward to:</p>
                
                <ul class="features">
                    <li class="feature-item"><span class="feature-icon">✔</span> Advanced Showroom Management</li>
                    <li class="feature-item"><span class="feature-icon">✔</span> Real-time Sales Analytics</li>
                    <li class="feature-item"><span class="feature-icon">✔</span> Verified Car Buyer Connections</li>
                </ul>

                <p>Once approved, you will be able to log in and start listing your vehicles for sale.</p>

                <a href="http://localhost:5173/seller/login" class="cta-button">Go to Seller Portal</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 DRIVE DEAL Automotive Solutions. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"DRIVE DEAL Support" <dummymail2003s@gmail.com>',
            to: email,
            subject: "Welcome to DRIVE DEAL - Your Seller Registration",
            html: htmlTemplate
        });
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

const sendUserWelcomeEmail = async (userData) => {
    const { first_name, last_name, email } = userData;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
            .header { background: #0f172a; padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px; }
            .header h1 span { color: #ffc000; }
            .content { padding: 40px; background: #ffffff; }
            .welcome-text { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
            .features { margin: 30px 0; padding: 0; list-style: none; }
            .feature-item { margin-bottom: 15px; display: flex; align-items: center; }
            .feature-icon { color: #ffc000; margin-right: 15px; font-size: 20px; }
            .cta-button { display: inline-block; padding: 16px 32px; background: #ffc000; color: #000000; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DRIVE <span>DEAL</span></h1>
            </div>
            <div class="content">
                <div class="welcome-text">Welcome to Drive Deal, ${first_name}!</div>
                <p>We're excited to have you as part of our premium car marketplace. Your account has been successfully created and you're now ready to find your dream car.</p>
                
                <p>Here's what you can do right now:</p>
                
                <ul class="features">
                    <li class="feature-item"><span class="feature-icon">✔</span> Browse Exclusive Car Inventories</li>
                    <li class="feature-item"><span class="feature-icon">✔</span> Send Purchase Requests to Sellers</li>
                    <li class="feature-item"><span class="feature-icon">✔</span> Track Your Vehicle Orders in Real-time</li>
                </ul>

                <p>Start your journey today and find the car you've always dreamed of.</p>

                <a href="http://localhost:5173/user/login" class="cta-button">Access Your Dashboard</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 Drive Deal Automotive Marketplace. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"Drive Deal Support" <dummymail2003s@gmail.com>',
            to: email,
            subject: "Welcome to Drive Deal - Your Premium Car Journey Starts Here",
            html: htmlTemplate
        });
        console.log(`User welcome email sent to ${email}`);
    } catch (error) {
        console.error("Error sending user welcome email:", error);
    }
};

const sendSaleConfirmationEmail = async (customerEmail, carData) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
            .header { background: #10b981; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .content { padding: 30px; background: #ffffff; }
            .success-badge { display: inline-block; padding: 8px 16px; background: #dcfce7; color: #15803d; border-radius: 100px; font-weight: 700; font-size: 14px; margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin: 20px 0 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .detail-item { font-size: 14px; }
            .detail-label { color: #64748b; font-weight: 600; }
            .detail-value { color: #0f172a; font-weight: 700; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DRIVE DEAL - Car Sold!</h1>
            </div>
            <div class="content">
                <div class="success-badge">Purchase Confirmed</div>
                <p>Congratulations! Your purchase request for the <strong>${carData.brand} ${carData.name}</strong> has been confirmed by the seller. The car is now officially yours!</p>
                
                <div class="section-title">Vehicle Info</div>
                <div class="detail-grid">
                    <div class="detail-item"><span class="detail-label">Model:</span> <span class="detail-value">${carData.model}</span></div>
                    <div class="detail-item"><span class="detail-label">Price:</span> <span class="detail-value">₹ ${carData.price?.toLocaleString()}</span></div>
                    <div class="detail-item"><span class="detail-label">Fuel:</span> <span class="detail-value">${carData.fuelType}</span></div>
                </div>

                <p>The seller will contact you shortly to finalize the paperwork and delivery.</p>
                <a href="http://localhost:5173/user/mypurchase_requests" style="display: block; padding: 14px; background: #0f172a; color: white; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 700; margin-top: 20px;">View My Orders</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 Drive Deal Automotive Marketplace. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"Drive Deal Confirmed" <dummymail2003s@gmail.com>',
            to: customerEmail,
            subject: "Congratulations! Your purchase of " + carData.brand + " " + carData.name + " is confirmed!",
            html: htmlTemplate
        });
    } catch (error) {
        console.error("Error sending sale confirmation email:", error);
    }
};

const sendPurchaseRequestNotificationToSeller = async (sellerEmail, carData, userData) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
            .header { background: #0f172a; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .header h1 span { color: #ffc000; }
            .content { padding: 30px; background: #ffffff; }
            .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin: 20px 0 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .detail-item { font-size: 14px; }
            .detail-label { color: #64748b; font-weight: 600; }
            .detail-value { color: #0f172a; font-weight: 700; }
            .cta-button { display: inline-block; padding: 14px 28px; background: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; text-align: center; width: 100%; box-sizing: border-box; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DRIVE DEAL - New Purchase Request</h1>
            </div>
            <div class="content">
                <p>Hello Seller,</p>
                <p>A new purchase inquiry has been received for one of your vehicles. Please review the details below and take action in your showroom dashboard.</p>
                
                <div class="section-title">Vehicle Details</div>
                <div class="detail-grid">
                    <div class="detail-item"><span class="detail-label">Car:</span> <span class="detail-value">${carData.brand} ${carData.name}</span></div>
                    <div class="detail-item"><span class="detail-label">Price:</span> <span class="detail-value">₹ ${carData.price?.toLocaleString()}</span></div>
                </div>

                <div class="section-title">Buyer Details</div>
                <div class="detail-grid">
                    <div class="detail-item"><span class="detail-label">Name:</span> <span class="detail-value">${userData.first_name} ${userData.last_name}</span></div>
                    <div class="detail-item"><span class="detail-label">Email:</span> <span class="detail-value">${userData.email}</span></div>
                    <div class="detail-item"><span class="detail-label">Phone:</span> <span class="detail-value">${userData.mobile}</span></div>
                </div>

                <a href="http://localhost:5173/seller/purchase_requests" class="cta-button">Go to Seller Dashboard</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 Drive Deal Automotive Marketplace. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"Drive Deal Notification" <dummymail2003s@gmail.com>',
            to: sellerEmail,
            subject: "Action Required: New Purchase Request for " + carData.brand + " " + carData.name,
            html: htmlTemplate
        });
    } catch (error) {
        console.error("Error sending purchase notification:", error);
    }
};

const sendReviewNotificationToSeller = async (sellerEmail, car, user, review) => {
    const mailOptions = {
        from: '"Drive Deal Feedback" <dummymail2003s@gmail.com>',
        to: sellerEmail,
        subject: `New Review for ${car.brand} ${car.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0f172a;">New Review Received!</h2>
                <p>Hello Seller,</p>
                <p>A customer has left feedback for your vehicle <strong>${car.brand} ${car.name}</strong>.</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
                    <p><strong>Customer:</strong> ${user.first_name} ${user.last_name}</p>
                    <p><strong>Rating:</strong> ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} (${review.rating}/5)</p>
                    <p><strong>Feedback:</strong> "${review.feedback}"</p>
                </div>
                
                <p>Check your seller dashboard for more details.</p>
                <p>Best regards,<br>Drive Deal Team</p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending review notification to seller:", error);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendUserWelcomeEmail,
    sendSaleConfirmationEmail,
    sendPurchaseRequestNotificationToSeller,
    sendReviewNotificationToSeller
};
