const consola = require("consola");
const models = require("./models/index.js");
const options = {
  seedUsers: true,
};

module.exports = async () => {
  const usersToCreate = [
    {
      name: "@rahmat058",
      email: "md.kazi.rahmat@gmail.com",
      password: "password",
      isVerified: true
    }
  ];

  if (options.seedUsers) {
    await models.User.findAll().then(async function (users) {
      if (!users.length) {
        for (let i = 0; i < usersToCreate.length; i++) {
          await models.User.build(usersToCreate[i]).save();
          console.log("User Created: " + usersToCreate[i].name);
        }
      } else {
        console.log("User already exist.  Not seeding Users.");
      }
    });
  }

  consola.success("Database seeding completed.");
};
