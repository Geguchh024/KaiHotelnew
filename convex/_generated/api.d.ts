/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authNode from "../authNode.js";
import type * as availability from "../availability.js";
import type * as b2 from "../b2.js";
import type * as gallery from "../gallery.js";
import type * as messages from "../messages.js";
import type * as resend from "../resend.js";
import type * as reservations from "../reservations.js";
import type * as rooms from "../rooms.js";
import type * as siteSettings from "../siteSettings.js";
import type * as sponsors from "../sponsors.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authNode: typeof authNode;
  availability: typeof availability;
  b2: typeof b2;
  gallery: typeof gallery;
  messages: typeof messages;
  resend: typeof resend;
  reservations: typeof reservations;
  rooms: typeof rooms;
  siteSettings: typeof siteSettings;
  sponsors: typeof sponsors;
  utils: typeof utils;
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
