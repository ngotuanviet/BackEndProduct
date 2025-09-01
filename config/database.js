const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
  logging: false, // Set to true to see SQL queries in console
});

module.exports.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "MySQL connection has been established successfully with Sequelize."
    );
    return sequelize;
  } catch (error) {
    console.error("Unable to connect to the database with Sequelize:", error);
    throw error;
  }
};

module.exports.sequelize = sequelize;
