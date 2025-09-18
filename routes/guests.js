const express = require("express");
const router = express.Router();
const {
  AddGuest,
  GetGuests,
  DeleteGuest,
  IsEmailAlreadyUsed,
} = require("../database/index");
const { GetInviteInfo } = require("../database/index");
const nodemailer = require("nodemailer");

router.post("/addGuest", (req, res) => {
  const { inviteId, guestName, guestEmail, guestCount } = req.query;
  // console.log(inviteId.inviteId, guestName)
  AddGuest(inviteId.inviteId, guestName, guestEmail, guestCount)
    .then(() => {
      res.send("guest added");
    })
    .catch(() => {
      throw Error;
    });
});

router.post("/deleteGuest", (req, res) => {
  const { inviteId, guestId } = req.query;
  DeleteGuest(inviteId, guestId)
    .then((result) => {
      res.send("success");
    })
    .catch((err) => {
      res.send("could no remove guest");
      throw Error;
    });
});

router.post("/getGuests", (req, res) => {
  const { userId } = req.query;
  GetGuests(userId)
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      throw Error;
    });
});

router.post("/isEmailAlreadyUsed", (req, res) => {
  const { email, inviteId } = req.query;

  IsEmailAlreadyUsed(email, inviteId)
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      throw Error;
    });
});

router.post("/sendRemindersToAllGuests", async (req, res) => {
  const { userId, inviteId } = req.query;

  const inviteInfo = await GetInviteInfo(inviteId);

  const type = inviteInfo.type;
  const name = inviteInfo.name;
  const date = inviteInfo.date;
  const location = inviteInfo.location;
  let subject = "";
  let text = "";

  // Set subject and text based on type
  switch (type) {
    case "1": // בר מצווה
      subject = `תזכורת לבר מצווה של ${name}`;
      text = `\nרצינו להזכיר לך שהבר מצווה של ${name} תתקיים בתאריך ${date} ב${location}.\nנשמח לראותך ולחגוג יחד את הרגע המיוחד!\n\nבברכה,\nצוות האירועים`;
      break;
    case "2": // בת מצווה
      subject = `תזכורת לבת מצווה של ${name}`;
      text = `\nרצינו להזכיר לך שהבת מצווה של ${name} מתקיימת בתאריך ${date} ב${location}.\nמחכים לראותך ולחגוג איתנו את האירוע!\n\nבברכה,\nצוות האירועים`;
      break;
    case "3": // חתונה
      subject = `תזכורת לחתונה של ${name}`;
      text = `\nרצינו להזכיר שהחתונה של ${name} תתקיים בתאריך ${date} ב${location}.\nנשמח לראותך ולחגוג יחד את היום המיוחד!\n\nבברכה,\nצוות האירועים`;
      break;
    case "4": // ברית
      subject = `תזכורת לברית של ${name}`;
      text = `\nתזכורת: הברית של ${name} תתקיים בתאריך ${date} ב${location}\nבברכה,\nצוות האירועים`;
      break;
    default:
      subject = `תזכורת לאירוע`;
      text = `\nזהו תזכורת לאירוע הקרוב שלך בתאריך ${date} ב${location}.\n\nבברכה,\nצוות האירועים`;
  }

  try {
    const result = await GetGuests(userId);
    const guests = result.guests;

    if (!guests || guests.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No guests found." });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    for (const guest of guests) {
      if (guest.guestEmail != "None") {
        try {
          await transporter.sendMail({
            from: process.env.GMAIL_ADDRESS,
            to: guest.guestEmail,
            subject: subject,
            html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
            שלום ${guest.guestName},<br><br>
            ${text.replace(/\n/g, "<br>")}
          </div>
        `,
          });
          console.log("Email sent to:", guest.guestEmail);
        } catch (err) {
          console.error("Error sending email to:", guest.guestEmail, err);
        }
      } else {
        console.log(
          "Email sending skiped " + guest.guestName + " because email is None"
        );
      }
    }

    return res.json({
      success: true,
      message: "Reminders sent to all guests.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { guestsRouter: router };
