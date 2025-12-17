import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;
    const { id: certificateId } = await context.params;

    if (!certificateId) {
      return NextResponse.json(
        { message: "Certificate ID missing" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch certificate with owner
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        owner: {
          select: {
            id: true,
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

    // 2️⃣ Access control
    const isOwner = certificate.ownerId === user.id;

    const isInstitutionAdmin =
      user.usertype === "INSTITUTION" &&
      user.admin === true &&
      user.institutionname === certificate.owner.institutionname;

    if (!isOwner && !isInstitutionAdmin) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    // 3️⃣ Fetch logs
    const logs = await prisma.certificateLog.findMany({
      where: { certificateId },
      orderBy: { createdAt: "desc" },
      include: {
        performedBy: {
          select: {
            id: true,
            username: true,
            email: true,
            usertype: true,
            admin: true,
          },
        },
      },
    });

    return NextResponse.json({
      certificateId,
      total: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Fetch certificate logs error:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificate logs" },
      { status: 500 }
    );
  }
}
