const expres = require("express");
const router = expres.Router();
const {
  addAccount,
  GetUserInfo,
  checkUserExistance,
  getAllExistingUsers,
  deleteUser,
  updateFirstLoginToFalse,
} = require("../database/index");
// const { addGuest, getGuests } = require("../database/index");

router.post("/getAll", (req, res) => {
  getAllExistingUsers()
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/delUser", (req, res) => {
  const _id = req.query._id;
  deleteUser(_id).then(() => {
    res.send("success");
  });
});
router.post("/addAccount", (req, res) => {
  const { name, password } = req.query;
  addAccount(name, password)
    .then((result) => {
      console.log(result);
      res.send(result._id);
    })
    .catch(() => {
      throw Error;
    });
});
router.post("/getUserInfo", (req, res) => {
  const { userId } = req.query;
  GetUserInfo(userId)
    .then((info) => {
      res.send(info);
    })
    .catch(() => {
      throw Error;
    });
});

router.post("/checkUserExistance", (req, res) => {
  const { name, password } = req.query;
  checkUserExistance(name, password).then((user) => {
    res.send(user);
  });
});

router.post("/updateFirstLoginToFalse", (req, res) => {
  const { userId } = req.query;

  updateFirstLoginToFalse(userId)
    .then((result) => {
      console.log(result);
      res.send(result._id);
    })
    .catch(() => {
      throw Error;
    });
});

module.exports = { userRouter: router };
