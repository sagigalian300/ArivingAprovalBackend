const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB_KEY;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const collection = client.db("EventArivingAprovals").collection("Users");
const collectionInvitation = client
  .db("EventArivingAprovals")
  .collection("Invites");
const collectionGuests = client.db("EventArivingAprovals").collection("guests");

const getAllExistingUsers = async () => {
  console.log("recieving account in existance");

  const response = await collection.find({}).toArray();
  return response;
};

const deleteUser = async (_id) => {
  const _ = await collection.deleteOne({ _id: new ObjectId(_id) });
  const __ = await collectionInvitation.deleteOne({
    userId: new ObjectId(_id),
  });
  const ___ = await collectionGuests.deleteOne({ userId: new ObjectId(_id) });

  console.log("User with id " + _id + " has been deleted");
  return { success: true };
};
const addAccount = async (name, password) => {
  const _id = new ObjectId();
  const inviteId = new ObjectId();
  const _ = collectionInvitation.insertOne({
    userId: _id,
    inviteId,
    name: "",
    date: null,
    location: "",
    otherDetails: "",
    latitude: null,
    longitude: null,
    placeForWaze: "",
    decoIndex: 0,
  });
  const __ = collectionGuests.insertOne({
    userId: _id,
    inviteId: inviteId,
    guests: [],
  });
  const response = await collection.insertOne({
    name,
    password,
    date: new Date(),
    _id,
    inviteId: inviteId,
    firstLogin: true,
  });
  return { success: response ? true : false, _id };
};

const checkUserExistance = async (name, password) => {
  const response = await collection.findOne({ name, password });
  return response;
};

const updateFirstLoginToFalse = async (userId) => {
  const response = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { firstLogin: false } }
  );
  return response;
};

const createInvitation = async (
  name,
  date,
  location,
  otherDetails,
  type,
  userId,
  latitude,
  longitude,
  placeForWaze,
  decoIndex
) => {
  const _ = await collectionInvitation.updateOne(
    { userId: new ObjectId(userId) },
    {
      $set: {
        name,
        date: new Date(date),
        location,
        otherDetails,
        type,
        latitude,
        longitude,
        placeForWaze,
        decoIndex,
      },
    }
  );
  return "success";
};

const GetUserInfo = async (userId) => {
  const response = await collection.findOne({ _id: new ObjectId(userId) });
  return response;
};

const GetInviteInfo = async (inviteId) => {
  const response = await collectionInvitation.findOne({
    inviteId: new ObjectId(inviteId),
  });
  return response;
};

const AddGuest = async (inviteId, guestName, guestEmail, guestCount) => {
  const date = new Date();
  const israelTime = date.toLocaleString("en-US", {
    timeZone: "Asia/Jerusalem",
  });

  const response = await collectionGuests.updateOne(
    { inviteId: new ObjectId(inviteId) },
    {
      $push: {
        guests: {
          guestName,
          guestEmail,
          guestCount,
          guestId: new ObjectId(),
          approvalDate: israelTime,
        },
      },
    }
  );
  return response;
};

const DeleteGuest = async (inviteId, guestId) => {
  try {
    const response = await collectionGuests.updateOne(
      { inviteId: new ObjectId(inviteId) },
      { $pull: { guests: { guestId: new ObjectId(guestId) } } }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

const GetGuests = async (userId) => {
  const response = await collectionGuests.findOne({
    userId: new ObjectId(userId),
  });

  return response;
};

const IsEmailAlreadyUsed = async (email, inviteId) => {
  try {
    const response = await collectionGuests.findOne({
      inviteId: new ObjectId(inviteId),
      "guests.guestEmail": email,
    });
    return response ? true : false;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addAccount,
  createInvitation,
  GetInviteInfo,
  GetUserInfo,
  AddGuest,
  checkUserExistance,
  GetGuests,
  DeleteGuest,
  IsEmailAlreadyUsed,
  getAllExistingUsers,
  deleteUser,
  updateFirstLoginToFalse,
};
