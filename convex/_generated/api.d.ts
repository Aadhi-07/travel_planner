/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as InviteEmail from "../InviteEmail.js";
import type * as access from "../access.js";
import type * as cleanup from "../cleanup.js";
import type * as communityPlans from "../communityPlans.js";
import type * as email from "../email.js";
import type * as expenses from "../expenses.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as invite from "../invite.js";
import type * as lib from "../lib.js";
import type * as plan from "../plan.js";
import type * as planSettings from "../planSettings.js";
import type * as rateLimit from "../rateLimit.js";
import type * as retrier from "../retrier.js";
import type * as token from "../token.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as weather from "../weather.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  InviteEmail: typeof InviteEmail;
  access: typeof access;
  cleanup: typeof cleanup;
  communityPlans: typeof communityPlans;
  email: typeof email;
  expenses: typeof expenses;
  feedback: typeof feedback;
  http: typeof http;
  images: typeof images;
  invite: typeof invite;
  lib: typeof lib;
  plan: typeof plan;
  planSettings: typeof planSettings;
  rateLimit: typeof rateLimit;
  retrier: typeof retrier;
  token: typeof token;
  users: typeof users;
  utils: typeof utils;
  weather: typeof weather;
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

export declare const components: {
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
};
