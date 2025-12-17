import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin } from "@/app/lib/permissions";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/app/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    // 🔐 Authorization
    const isOwner = certificate.ownerId === user.id;
    const isAdmin =
      isInstitutionAdmin({
        ...user,
        institutionname: user.institutionname === null ? undefined : user.institutionname,
      }) &&
      user.institutionname === certificate.owner.institutionname;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // 🪣 Generate signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: certificate.s3Key,
      ResponseContentDisposition: `attachment; filename="${certificate.title || "certificate"}"`,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 minutes
    });

    return NextResponse.json({
      downloadUrl: signedUrl,
      expiresIn: "5 minutes",
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Failed to generate download link" },
      { status: 500 }
    );
  }
}
