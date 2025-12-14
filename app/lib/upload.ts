import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "./s3"

export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read",
    })
  )

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
