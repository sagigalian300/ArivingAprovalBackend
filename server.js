const express = require("express");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: [
    "https://sage-sherbet-ccb1c2.netlify.app", //old netlify
    "http://localhost:3000", // localhost
    "https://eventapprovals.netlify.app", // new netlify
    "https://eventapprovals.firebaseapp.com", // firebase (will it solve the not opening problem?)
  ],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Access-Control-Allow-Origin"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

// const PORT = 8080 || process.env.PORT; // the port was 3001 before..
const PORT = 3001 || process.env.PORT; // the port was 3001 before..

const { userRouter } = require("./routes/users");
const { guestsRouter } = require("./routes/guests");
const { invitationsRouter } = require("./routes/invitations");
app.use("/users", userRouter);
app.use("/guests", guestsRouter);
app.use("/invitations", invitationsRouter);

app.listen(PORT, () => {
  console.log("Server is running...");
});
