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
    },
    {
      name: "user1",
      email: "user1@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user2",
      email: "user2@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user3",
      email: "user3@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user4",
      email: "user4@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user5",
      email: "user5@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user6",
      email: "user6@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user7",
      email: "user7@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user8",
      email: "user8@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user9",
      email: "user9@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user10",
      email: "user10@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user11",
      email: "user11@gmail.com",
      password: "123456",
      isVerified: true
    },
    {
      name: "user12",
      email: "user12@gmail.com",
      password: "123456",
      isVerified: true
    },
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
