import env from "dotenv";

env.config();

export default {
  cam_endpoint: process.env["CAM_ENDPOINT"] ?? "http://192.168.30.181",
}
