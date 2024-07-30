module.exports = {
  dev: {
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    retry: {
      max: 3,
    },
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST,
    dialect: "postgres",
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
  production: {
    username: process.env.TWITTER_RECOMMENDATION_USER,
    password: process.env.TWITTER_RECOMMENDATION_PASSWORD,
    database: process.env.TWITTER_RECOMMENDATION_DATABASE,
    host: process.env.TWITTER_RECOMMENDATION_HOST,
    port: process.env.PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    seederStorage: "sequelize",
  },
};
