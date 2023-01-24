const express = require("express");
const app = express();
require("./startup/config")();
require("./startup/routes")(app);
require("express-async-errors");
require("./startup/db")();
require("./startup/logging")();
const logger = require("./middleware/logger");

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Listening on port ${port}...`);
});
