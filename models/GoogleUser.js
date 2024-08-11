import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js"; // Import your database connection

// Define the GoogleUser model
export const GoogleUser = sequelize.define("GoogleUser", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure that Google IDs are unique
  },
});

// Sync the model with the database
GoogleUser.sync()
  .then(() => console.log("GoogleUser table created"))
  .catch((err) => console.error("Error creating GoogleUser table:", err));
