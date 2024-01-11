const expres = require("express");
const router = expres.Router();
const {
  addAccount,
  GetUserInfo,
  checkUserExistance,
  getAllExistingUsers,
  deleteUser,
} = require("../database/index");
// const { addGuest, getGuests } = require("../database/index");

router.post("/getAll", (req, res) => {
  getAllExistingUsers().then((result) => {
    console.log(result);
    res.send(result);
  }).catch(err => {
    console.log(err)
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

// router.post("/addGuest", (req, res) => {
//   const fName = req.query.fName;
//   const lName = req.query.lName;
//   const number = req.query.number;
//   const phone = req.query.phone;

//   addGuest(fName, lName, number, phone).then((result) => {
//     if (result.ok) {
//       res.send("Successfuly added a guest !");
//     } else {
//       res.send("Could not add to database.");
//     }
//   });
// });

// router.get("/getGuests", (req, res) => {

//   getGuests()
//     .then((result) => {
//         console.log(result)
//         res.send(result);
//     })
//     .catch(() => {
//       res.send("error");
//     });
// });

module.exports = { userRouter: router };
