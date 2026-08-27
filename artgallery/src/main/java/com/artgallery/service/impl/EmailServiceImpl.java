package com.artgallery.service.impl;

import com.artgallery.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;


    // =====================================================
    // COMMON EMAIL SENDER
    // =====================================================

    private void sendHtmlEmail(
            String to,
            String subject,
            String html
    ) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setTo(to);

            helper.setSubject(subject);

            helper.setText(
                    html,
                    true
            );

            // =================================================
            // AURELIAN GALLERY LOGO
            // =================================================

            ClassPathResource logo =
                    new ClassPathResource(
                            "email/aurelian-logo.png"
                    );

            helper.addInline(
                    "aurelian-logo",
                    logo
            );

            mailSender.send(message);

        } catch (MessagingException e) {

            throw new RuntimeException(
                    "Failed to send email",
                    e
            );
        }
    }


    // =====================================================
    // COMMON EMAIL TEMPLATE
    // =====================================================

    private String emailTemplate(
            String content
    ) {

        return """
                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">

                    <title>Aurelian Gallery</title>

                </head>


                <body style="
                    margin:0;
                    padding:0;
                    background:#eeeeeb;
                    font-family:Arial, Helvetica, sans-serif;
                    color:#3f4742;
                ">


                    <table
                        width="100%%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background:#eeeeeb; padding:35px 10px;"
                    >

                        <tr>

                            <td align="center">


                                <!-- MAIN CONTAINER -->

                                <table
                                    width="600"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        width:100%%;
                                        max-width:600px;
                                        background:#f8f7f2;
                                        border:1px solid #deded7;
                                    "
                                >


                                    <!-- HEADER -->

                                    <tr>

                                        <td
                                            align="center"
                                            style="
                                                background:#050b08;
                                                padding:35px 20px;
                                                border-top:4px solid #b58a45;
                                            "
                                        >

                                            <img
                                                src="cid:aurelian-logo"
                                                alt="Aurelian Gallery"
                                                width="180"
                                                style="
                                                    display:block;
                                                    width:180px;
                                                    max-width:80%%;
                                                    height:auto;
                                                "
                                            >

                                        </td>

                                    </tr>


                                    <!-- CONTENT -->

                                    <tr>

                                        <td
                                            style="
                                                padding:40px 40px 35px 40px;
                                                font-size:15px;
                                                line-height:1.7;
                                            "
                                        >

                                            %s

                                        </td>

                                    </tr>


                                    <!-- FOOTER -->

                                    <tr>

                                        <td
                                            align="center"
                                            style="
                                                background:#eeeee8;
                                                border-top:1px solid #deded7;
                                                padding:25px 20px;
                                                color:#737a75;
                                                font-size:12px;
                                                line-height:1.6;
                                            "
                                        >

                                            <strong
                                                style="
                                                    color:#3f4742;
                                                    font-size:13px;
                                                "
                                            >
                                                Aurelian Gallery
                                            </strong>

                                            <br>

                                            Art. Elegance. Inspiration.

                                            <br><br>

                                            This is an automated message.
                                            Please do not reply directly to
                                            this email.

                                        </td>

                                    </tr>


                                </table>


                            </td>

                        </tr>

                    </table>


                </body>

                </html>
                """.formatted(content);
    }


    // =====================================================
    // PASSWORD RESET OTP
    // =====================================================

    @Override
    public void sendOtp(
            String email,
            String otp
    ) {

        String content = """

                <div
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#a47a3c;
                        margin-bottom:12px;
                    "
                >
                    Account Security
                </div>


                <h1
                    style="
                        margin:0 0 20px 0;
                        color:#27332d;
                        font-size:28px;
                        font-weight:500;
                    "
                >
                    Password Reset
                </h1>


                <p>
                    Dear User,
                </p>


                <p>
                    We received a request to reset the password
                    for your Aurelian Gallery account.
                </p>


                <p>
                    Your One-Time Password is:
                </p>


                <div
                    style="
                        margin:25px 0;
                        padding:20px;
                        background:#ffffff;
                        border:1px solid #deded7;
                        text-align:center;
                        font-size:32px;
                        letter-spacing:8px;
                        font-weight:bold;
                        color:#8b662f;
                    "
                >
                    %s
                </div>


                <p>
                    This OTP is valid for
                    <strong>5 minutes</strong>.
                    For your security, please do not share
                    this code with anyone.
                </p>


                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>


                <p style="margin-top:30px;">
                    Warm regards,<br>
                    <strong>Aurelian Gallery</strong>
                </p>

                """.formatted(escapeHtml(otp));


        sendHtmlEmail(
                email,
                "Aurelian Gallery | Password Reset OTP",
                emailTemplate(content)
        );
    }


    // =====================================================
    // ORDER CONFIRMATION
    // =====================================================

    @Override
    public void sendOrderConfirmation(
            String email,
            String customerName,
            Long orderId,
            double totalAmount
    ) {

        String content = """

                <div
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#a47a3c;
                        margin-bottom:12px;
                    "
                >
                    Acquisition
                </div>


                <h1
                    style="
                        margin:0 0 20px 0;
                        color:#27332d;
                        font-size:28px;
                        font-weight:500;
                    "
                >
                    Order Confirmed
                </h1>


                <p>
                    Dear <strong>%s</strong>,
                </p>


                <p>
                    Thank you for your purchase from
                    Aurelian Gallery.
                    Your order has been placed successfully.
                </p>


                <!-- ORDER CARD -->

                <table
                    width="100%%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin:30px 0;
                        background:#ffffff;
                        border:1px solid #deded7;
                    "
                >

                    <tr>

                        <td
                            style="
                                padding:20px;
                                color:#737a75;
                                font-size:12px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                            "
                        >
                            Order ID
                        </td>

                        <td
                            align="right"
                            style="
                                padding:20px;
                                font-weight:bold;
                                color:#27332d;
                            "
                        >
                            #%s
                        </td>

                    </tr>


                    <tr>

                        <td
                            style="
                                padding:0 20px 20px 20px;
                                color:#737a75;
                                font-size:12px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                            "
                        >
                            Total
                        </td>

                        <td
                            align="right"
                            style="
                                padding:0 20px 20px 20px;
                                font-size:20px;
                                font-weight:bold;
                                color:#8b662f;
                            "
                        >
                            ₹ %,.2f
                        </td>

                    </tr>

                </table>


                <p>
                    We will notify you when the status of your
                    order changes.
                </p>


                <p>
                    You can view your order from your
                    Aurelian Gallery account.
                </p>


                <p style="margin-top:30px;">
                    Warm regards,<br>
                    <strong>Aurelian Gallery</strong>
                </p>

                """.formatted(
                escapeHtml(customerName),
                orderId,
                totalAmount
        );


        sendHtmlEmail(
                email,
                "Aurelian Gallery | Order #" + orderId + " Confirmed",
                emailTemplate(content)
        );
    }


    // =====================================================
    // ORDER STATUS UPDATE
    // =====================================================

    @Override
    public void sendOrderStatusUpdate(
            String email,
            String customerName,
            Long orderId,
            String status,
            double totalAmount
    ) {

        String statusMessage;


        switch (status) {

            case "PACKED":

                statusMessage =
                        "Your order has been packed and is ready for shipment.";

                break;


            case "SHIPPED":

                statusMessage =
                        "Your order has been shipped and is on its way.";

                break;


            case "DELIVERED":

                statusMessage =
                        "Your order has been delivered successfully.";

                break;


            case "CANCELLED":

                statusMessage =
                        "Your order has been cancelled.";

                break;


            case "PLACED":

                statusMessage =
                        "Your order has been placed successfully.";

                break;


            default:

                statusMessage =
                        "Your order status has been updated to "
                                + status
                                + ".";

                break;
        }


        String content = """

                <div
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#a47a3c;
                        margin-bottom:12px;
                    "
                >
                    Order Update
                </div>


                <h1
                    style="
                        margin:0 0 20px 0;
                        color:#27332d;
                        font-size:28px;
                        font-weight:500;
                    "
                >
                    Order Status Updated
                </h1>


                <p>
                    Dear <strong>%s</strong>,
                </p>


                <p>
                    There is an update regarding your
                    Aurelian Gallery order.
                </p>


                <!-- STATUS CARD -->

                <table
                    width="100%%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        margin:30px 0;
                        background:#ffffff;
                        border:1px solid #deded7;
                    "
                >

                    <tr>

                        <td
                            style="
                                padding:20px;
                                color:#737a75;
                                font-size:12px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                            "
                        >
                            Order ID
                        </td>

                        <td
                            align="right"
                            style="
                                padding:20px;
                                font-weight:bold;
                                color:#27332d;
                            "
                        >
                            #%s
                        </td>

                    </tr>


                    <tr>

                        <td
                            style="
                                padding:0 20px 20px 20px;
                                color:#737a75;
                                font-size:12px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                            "
                        >
                            Order Total
                        </td>

                        <td
                            align="right"
                            style="
                                padding:0 20px 20px 20px;
                                color:#8b662f;
                                font-weight:bold;
                            "
                        >
                            ₹ %,.2f
                        </td>

                    </tr>


                    <tr>

                        <td
                            style="
                                padding:20px;
                                border-top:1px solid #eeeeeb;
                                color:#737a75;
                                font-size:12px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                            "
                        >
                            Current Status
                        </td>

                        <td
                            align="right"
                            style="
                                padding:20px;
                                border-top:1px solid #eeeeeb;
                                color:#8b662f;
                                font-weight:bold;
                                letter-spacing:1px;
                            "
                        >
                            %s
                        </td>

                    </tr>

                </table>


                <div
                    style="
                        background:#eeeee8;
                        border-left:4px solid #b58a45;
                        padding:18px 20px;
                        margin:25px 0;
                    "
                >

                    %s

                </div>


                <p>
                    You can view your order from your
                    Aurelian Gallery account.
                </p>


                <p style="margin-top:30px;">
                    Warm regards,<br>
                    <strong>Aurelian Gallery</strong>
                </p>

                """.formatted(
                escapeHtml(customerName),
                orderId,
                totalAmount,
                escapeHtml(status),
                escapeHtml(statusMessage)
        );


        sendHtmlEmail(
                email,
                "Aurelian Gallery | Order #" +
                        orderId +
                        " Status Update",
                emailTemplate(content)
        );
    }


    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    @Override
    public void sendVerificationEmail(
            String email,
            String name,
            String verificationLink
    ) {

        String content = """

                <div
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#a47a3c;
                        margin-bottom:12px;
                    "
                >
                    Welcome
                </div>


                <h1
                    style="
                        margin:0 0 20px 0;
                        color:#27332d;
                        font-size:28px;
                        font-weight:500;
                    "
                >
                    Verify Your Email
                </h1>


                <p>
                    Dear <strong>%s</strong>,
                </p>


                <p>
                    Welcome to Aurelian Gallery.
                </p>


                <p>
                    Thank you for creating your account.
                    Before you begin exploring the collection,
                    please verify your email address.
                </p>


                <!-- BUTTON -->

                <div
                    style="
                        text-align:center;
                        margin:35px 0;
                    "
                >

                    <a
                        href="%s"
                        style="
                            display:inline-block;
                            background:#27332d;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 30px;
                            font-size:14px;
                            letter-spacing:1px;
                        "
                    >
                        VERIFY EMAIL
                    </a>

                </div>


                <p>
                    This verification link is valid for
                    <strong>24 hours</strong>.
                </p>


                <p style="font-size:13px; color:#737a75;">
                    If the button does not work, copy and paste
                    the following link into your browser:
                </p>


                <p
                    style="
                        font-size:12px;
                        color:#8b662f;
                        word-break:break-all;
                    "
                >
                    %s
                </p>


                <p>
                    If you did not create this account,
                    you can safely ignore this email.
                </p>


                <p style="margin-top:30px;">
                    Warm regards,<br>
                    <strong>Aurelian Gallery</strong>
                </p>

                """.formatted(
                escapeHtml(name),
                escapeHtml(verificationLink),
                escapeHtml(verificationLink)
        );


        sendHtmlEmail(
                email,
                "Aurelian Gallery | Verify Your Email",
                emailTemplate(content)
        );
    }


    // =====================================================
    // ANNOUNCEMENT
    // =====================================================

    @Override
    public void sendAnnouncementEmail(
            String email,
            String name,
            String title,
            String message
    ) {

        String content = """

                <div
                    style="
                        font-size:12px;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#a47a3c;
                        margin-bottom:12px;
                    "
                >
                    Aurelian Gallery
                </div>


                <h1
                    style="
                        margin:0 0 20px 0;
                        color:#27332d;
                        font-size:28px;
                        font-weight:500;
                    "
                >
                    %s
                </h1>


                <p>
                    Dear <strong>%s</strong>,
                </p>


                <div
                    style="
                        margin:30px 0;
                        padding:25px;
                        background:#ffffff;
                        border:1px solid #deded7;
                        line-height:1.8;
                    "
                >

                    %s

                </div>


                <p>
                    Thank you for being a part of
                    Aurelian Gallery.
                </p>


                <p>
                    We appreciate your continued support.
                </p>


                <p style="margin-top:30px;">
                    Warm regards,<br>
                    <strong>Aurelian Gallery</strong>
                </p>

                """.formatted(
                escapeHtml(title),
                escapeHtml(name),
                formatMessage(message)
        );


        sendHtmlEmail(
                email,
                "Aurelian Gallery | " + title,
                emailTemplate(content)
        );
    }


    // =====================================================
    // HTML ESCAPING
    // =====================================================

    private String escapeHtml(
            String value
    ) {

        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }


    // =====================================================
    // FORMAT ANNOUNCEMENT MESSAGE
    // =====================================================

    private String formatMessage(
            String message
    ) {

        if (message == null) {
            return "";
        }

        return escapeHtml(message)
                .replace("\n", "<br>");
    }
}