const express = require("express");
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = express.Router();

router.get("/", protect, getAllSkills);
router.get("/:id", protect, getSkillById);

router.post(
  "/",
  protect,
  [
    body("name").notEmpty().withMessage("Skill name is required"),
    body("level").isIn(["Beginner", "Intermediate", "Expert"]).withMessage("Invalid skill level"),
    body("experience").optional().isString(),
    body("description").optional().isString(),
  ],
  createSkill
);

router.put(
  "/:id",
  protect,
  [
    body("name").optional().notEmpty().withMessage("Skill name cannot be empty"),
    body("level").optional().isIn(["Beginner", "Intermediate", "Expert"]).withMessage("Invalid skill level"),
    body("experience").optional().isString(),
    body("description").optional().isString(),
  ],
  updateSkill
);

router.delete("/:id", protect, deleteSkill);

module.exports = router;
