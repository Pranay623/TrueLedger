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

    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        owner: {
          select: {
            institutionname: true
          }
        }
      }
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    // 🔐 Access Check
    const isOwner = certificate.ownerId === user.id;
    const isAdmin = user.usertype === "INSTITUTION" &&
      user.admin === true &&
      user.institutionname === certificate.owner.institutionname;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const logs = await prisma.certificateLog.findMany({
      where: { certificateId },
      orderBy: { createdAt: "asc" },
      select: {
        action: true,
        createdAt: true,
        performedBy: {
          select: {
            fullName: true,
            usertype: true,
          },
        },
      },
    });

    const timeline = logs.map((log) => ({
      action: log.action,
      performedBy:
        log.performedBy.usertype === "INSTITUTION"
          ? "Institution Admin"
          : log.performedBy.fullName ?? "User",
      at: log.createdAt,
    }));

    return NextResponse.json({
      certificateId,
      timeline,
    });
  } catch (error) {
    console.error("Timeline error:", error);
    return NextResponse.json(
      { message: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}
