export const IS_PROD = process.env.NODE_ENV === "production";
export const POSTGRES_URL = IS_PROD
  ? `${process.env.DATABASE_URL}?sslmode=require`
  : `${process.env.DATABASE_URL}`;
