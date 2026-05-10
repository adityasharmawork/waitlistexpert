/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as crons from "../crons.js";
import type * as emails from "../emails.js";
import type * as feed from "../feed.js";
import type * as http from "../http.js";
import type * as milestones from "../milestones.js";
import type * as signups from "../signups.js";
import type * as users from "../users.js";
import type * as waitlists from "../waitlists.js";
import type * as watchers from "../watchers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  crons: typeof crons;
  emails: typeof emails;
  feed: typeof feed;
  http: typeof http;
  milestones: typeof milestones;
  signups: typeof signups;
  users: typeof users;
  waitlists: typeof waitlists;
  watchers: typeof watchers;
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
