/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as cleanup from "../cleanup.js";
import type * as crons from "../crons.js";
import type * as email from "../email.js";
import type * as functions from "../functions.js";
import type * as model_auth from "../model/auth.js";
import type * as model_files from "../model/files.js";
import type * as model_passwords from "../model/passwords.js";
import type * as model_payloads from "../model/payloads.js";
import type * as model_rooms from "../model/rooms.js";
import type * as rooms from "../rooms.js";
import type * as sessions from "../sessions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  cleanup: typeof cleanup;
  crons: typeof crons;
  email: typeof email;
  functions: typeof functions;
  "model/auth": typeof model_auth;
  "model/files": typeof model_files;
  "model/passwords": typeof model_passwords;
  "model/payloads": typeof model_payloads;
  "model/rooms": typeof model_rooms;
  rooms: typeof rooms;
  sessions: typeof sessions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
