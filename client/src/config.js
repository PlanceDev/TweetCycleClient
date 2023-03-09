let SOLID_APP_MODE = "production";
let SOLID_APP_API_SERVER;

if (SOLID_APP_MODE === "development") {
  SOLID_APP_API_SERVER = "http://127.0.0.1:5000/api";
} else if (SOLID_APP_MODE === "production") {
  SOLID_APP_API_SERVER = "https://tweetcycle.com/api";
}

export { SOLID_APP_MODE, SOLID_APP_API_SERVER };
