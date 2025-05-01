const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Skill = require("./models/Skill");
const Session = require("./models/Session");

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/skillxchange", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // Clean existing data
    await User.deleteMany();
    await Skill.deleteMany();
    await Session.deleteMany();

    console.log("🧹 Old data cleared");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = await User.insertMany([
      { name: "Amina Warsame", email: "amina@example.com", password: hashedPassword },
      { name: "Mohamed Ali", email: "mohamed@example.com", password: hashedPassword },
      { name: "Layla Hassan", email: "layla@example.com", password: hashedPassword }
    ]);

    // Insert Skills with user field
    const skills = await Skill.insertMany([
      { name: "Python", level: "Expert", experience: "5 years", description: "Backend with Django and Flask.", user: users[0]._id },
      { name: "React", level: "Intermediate", experience: "2 years", description: "Frontend development.", user: users[1]._id },
      { name: "Graphic Design", level: "Expert", experience: "6 years", description: "Figma and Adobe XD.", user: users[2]._id },
      { name: "Data Analysis", level: "Intermediate", experience: "3 years", description: "Excel and Pandas.", user: users[1]._id }
    ]);

    // Update users with skills they can teach/learn
    users[0].skillsICanTeach = [skills[0]._id];
    users[0].skillsIWantToLearn = [skills[1]._id];
    users[1].skillsICanTeach = [skills[1]._id];
    users[1].skillsIWantToLearn = [skills[3]._id];
    users[2].skillsICanTeach = [skills[2]._id];
    users[2].skillsIWantToLearn = [skills[0]._id];

    await Promise.all(users.map(user => user.save()));

    // Insert Sessions
    await Session.insertMany([
        {
          learner: users[0]._id,
          teacher: users[1]._id,
          skill: skills[1]._id,
          scheduledAt: new Date("2025-05-03T10:00:00Z"),
          status: "pending",
          notes: "Excited to learn React!"
        },
        {
          learner: users[2]._id,
          teacher: users[0]._id,
          skill: skills[0]._id,
          scheduledAt: new Date("2025-05-06T15:00:00Z"),
          status: "confirmed",
          notes: "Learning Python basics."
        }
      ])
      

    console.log("🌟 Database Seeded Successfully!");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
