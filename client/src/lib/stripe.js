import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICE_ID = {
  seeker_pro: "price_1UUtki2KnGy6ePsJFSRWTBYK",
  seeker_premium: "price_1UWJwZ2KnGy6ePsJ2eedkOks",
  recruiter_growth: "price_1UWJyp2KnGy6ePsJ9S3FVUja",
  recruiter_enterprise: "price_1UWK0R2KnGy6ePsJg33vGOCx",
};