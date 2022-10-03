const router = require("express").Router();

const {
  getAllUsers,
  createUser,
  addFriend,
  deleteFriend,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../../controllers/user-controller");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:userId/friend/:friendId").post(addFriend).delete(deleteFriend);
router.route("/:userId").get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = router;
