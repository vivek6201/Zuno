import App from "./app"
import LoadConfig from "./config";

// Loads env from the file
const config = new LoadConfig().getConfig();

// Creating app instance
const app = new App();

// Starting app
app.start(config);