import { config } from "dotenv";

config()

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCES_KEY_ID = process.env.AWS_ACCES_KEY_ID;
export const AWS_SECRET_ACCES_KEY = process.env.AWS_SECRET_ACCES_KEY;

