import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin } from "@/app/lib/permissions";
import crypto from "crypto";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const { id } = await context.params;

    // 🔥 FETCH FULL USER FROM DB
    const admin = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        usertype: true,
        admin: true,
        institutionname: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (
      !isInstitutionAdmin({
        ...admin,
        institutionname: admin.institutionname === null ? undefined : admin.institutionname,
      })
    ) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
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

    if (certificate.status !== "PENDING") {
      return NextResponse.json(
        { message: "Certificate already processed" },
        { status: 400 }
      );
    }

    if (
      admin.institutionname &&
      certificate.owner.institutionname !== admin.institutionname
    ) {
      return NextResponse.json(
        { message: "Institution mismatch" },
        { status: 403 }
      );
    }

    const verificationHash = crypto
      .createHash("sha256")
      .update(
        `${certificate.id}:${certificate.fileUrl}:${certificate.createdAt.toISOString()}`
      )
      .digest("hex");

    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        status: "APPROVED",
        verificationHash,
      },
    });

    return NextResponse.json({
      message: "Certificate approved",
      certificate: updated,
    });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { message: "Approval failed" },
      { status: 500 }
    );
  }
}
