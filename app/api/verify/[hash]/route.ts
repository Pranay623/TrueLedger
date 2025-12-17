import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await context.params;

    if (!hash) {
      return NextResponse.json(
        { message: "Verification hash missing" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findFirst({
      where: { verificationHash: hash },
      include: {
        owner: {
          select: {
            fullName: true,
            email: true,
            institutionname: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { verified: false, message: "Invalid or unknown certificate" },
        { status: 404 }
      );
    }

    if (certificate.status !== "APPROVED") {
      return NextResponse.json(
        {
          verified: false,
          message: "Certificate not approved yet",
          status: certificate.status,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      certificate: {
        id: certificate.id,
        title: certificate.title,
        description: certificate.description,
        issuedAt: certificate.createdAt,
        owner: certificate.owner,
        fileUrl: certificate.fileUrl,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
