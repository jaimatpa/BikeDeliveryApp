const consola = require("consola");
const models = require("./models/index.js");
const options = {
  seedUsers: true,
};

module.exports = async () => {
  const usersToCreate = [
    {
      name: "Super Admin",
      email: "admin@paradynamix.com",
      password: "password",
      isVerified: true,
      userType: 3,
    },
  ];
  await models.User.build(usersToCreate[0]).save()
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

  // if (options.seedUsers) {
  //   await models.User.findAll().then(async function (users) {
  //     if (!users.length) {
  //       console.log("Creating 50 Users...");
  //       for (let i = 1; i <= 50; i++) {
  //         await models.User.build({
  //           name: `user${i}`,
  //           email: `user${i}@gmail.com`,
  //           password: "password",
  //           isVerified: true,
  //         }).save();
  //       }
  //       console.log("Users Created");
  //     } else {
  //       console.log("Users already exist.  Not seeding Users.");
  //     }
  //   });
  // }

  consola.success("Database seeding completed.");
};
