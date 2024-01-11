const express = require("express");
const router = express.Router();
const {AddGuest, GetGuests, DeleteGuest, IsPhoneNumberAlreadyUsed} = require('../database/index');

router.post("/addGuest", (req, res) => {
  const { inviteId, guestName, guestPhone, guestCount } = req.query;
  // console.log(inviteId.inviteId, guestName)
  AddGuest(inviteId.inviteId, guestName, guestPhone, guestCount)
    .then(() => {
      res.send("guest added");
    })
    .catch(() => {
      throw Error;
    });
});

router.post("/deleteGuest", (req, res) => {
  const {inviteId, guestId} = req.query;
  DeleteGuest(inviteId, guestId).then(result => {
    res.send('success')
  }).catch(err => {
    res.send('could no remove guest')
    throw Error;
  })
})

router.post("/getGuests", (req, res) => {
  const {userId} = req.query;
  GetGuests(userId).then(result => {
    res.send(result)
  }).catch(() => {
    throw Error;
  });
})

router.post("/isPhoneNumberAlreadyUsed", (req, res) => {
  const {phoneNumber, inviteId} = req.query;
  
  IsPhoneNumberAlreadyUsed(phoneNumber, inviteId).then(result => {
    res.send(result)
  }).catch(() => {
    throw Error;
  })
})


module.exports = { guestsRouter: router };
