import { NhostClient } from "@nhost/react";

export const nhost = new NhostClient({
  subdomain: process.env.SUBDOMAIN,
  region: process.env.REGION
});
