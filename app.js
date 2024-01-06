const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize("Map", "postgres", "anbu@2023", {
  host: "localhost",
  dialect: "postgres",
});

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const UserProfile = sequelize.define("UserProfile", {
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasOne(UserProfile);
UserProfile.belongsTo(User);

app.post("/api/register-step1", async (req, res) => {
  try {
    const { username, password, email, age } = req.body;
    const user = await User.create({ username, password, email, age });
    res.status(200).json({ userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/register-step2", async (req, res) => {
  try {
    const { userId, city, state, landmark, pincode } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = await UserProfile.create({
      city,
      state,
      landmark,
      pincode,
    });
    await user.setUserProfile(userProfile);

    res.status(200).json({ message: "Registration completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userId = 1;

    res.status(200).json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

sequelize.sync({ force: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
