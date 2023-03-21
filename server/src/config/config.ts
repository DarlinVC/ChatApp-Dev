import * as dotenv from "dotenv";
dotenv.config();

export default {
    PORT: process.env.PORT,
    DB: {
        URL: process.env.URL_DB,
        USER: process.env.USER || "",
        PASSWORD: process.env.USER_DB_PASS || ""
    },
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}