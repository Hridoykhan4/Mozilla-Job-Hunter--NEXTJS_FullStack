// To handle API requests, you need to set up a route handler on your server.

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const {POST, GET} = toNextJsHandler(auth)

