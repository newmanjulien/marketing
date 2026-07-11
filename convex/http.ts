import { httpRouter } from "convex/server";
import {
  successRoomUploadOptions,
  uploadSuccessRoomFile,
} from "./successRoomUploads";

const http = httpRouter();

http.route({
  path: "/success-room/upload",
  method: "POST",
  handler: uploadSuccessRoomFile,
});

http.route({
  path: "/success-room/upload",
  method: "OPTIONS",
  handler: successRoomUploadOptions,
});

export default http;
