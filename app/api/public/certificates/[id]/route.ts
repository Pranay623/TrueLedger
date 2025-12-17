import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            fullName: true,
            institutionname: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: certificate.id,
      title: certificate.title,
      description: certificate.description,
      status: certificate.status,
      verificationHash: certificate.verificationHash,
      issuedBy: certificate.owner.institutionname,
      ownerName: certificate.owner.fullName,
      createdAt: certificate.createdAt,
    });
  } catch (error) {
    console.error("Public verify error:", error);
    return NextResponse.json(
      { message: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}
