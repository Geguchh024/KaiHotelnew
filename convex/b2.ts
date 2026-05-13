"use node";

import { v, ConvexError } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Uploads a file to Backblaze B2 via the Convex backend (server-side).
 * BlurHash is generated client-side and passed in as an argument.
 */
export const uploadFile = action({
  args: {
    sessionToken: v.string(),
    fileName: v.string(),
    contentType: v.string(),
    fileData: v.string(), // base64-encoded file content
    blurhash: v.optional(v.string()), // generated client-side
  },
  handler: async (ctx, args) => {
    // Validate the admin session.
    const isValid: boolean = await ctx.runQuery(internal.utils.checkSession, {
      sessionToken: args.sessionToken,
    });
    if (!isValid) {
      throw new ConvexError("Unauthorized");
    }

    const keyId = process.env.B2_APPLICATION_KEY_ID;
    const applicationKey = process.env.B2_APPLICATION_KEY;
    const bucketName = process.env.B2_BUCKET_NAME;
    const endpoint = process.env.B2_ENDPOINT;

    if (!keyId || !applicationKey || !bucketName || !endpoint) {
      throw new ConvexError("B2 environment variables are not configured");
    }

    // Derive region from the endpoint (e.g. "eu-central-003").
    const regionMatch = endpoint.match(/^s3\.([^.]+)\.backblazeb2\.com$/);
    const region = regionMatch ? regionMatch[1] : "us-west-002";

    // Build a unique object key.
    const sanitized = args.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectKey = `gallery/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}-${sanitized}`;

    // Decode the base64 file data.
    const fileBuffer = Buffer.from(args.fileData, "base64");

    const s3 = new S3Client({
      region,
      endpoint: `https://${endpoint}`,
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: applicationKey,
      },
      forcePathStyle: true,
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: args.contentType,
      Body: fileBuffer,
    });

    await s3.send(command);

    // Public download URL.
    const publicUrl = `https://${endpoint}/${bucketName}/${objectKey}`;

    return { publicUrl, objectKey, blurhash: args.blurhash ?? null };
  },
});
