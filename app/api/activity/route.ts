import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) return auth.error;

    const user = auth.user;

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 10);

    const isAdmin =
      user.usertype === "INSTITUTION" && user.admin === true;

    const logs = await prisma.certificateLog.findMany({
      where: isAdmin
        ? {
          certificate: {
            owner: {
              institutionname: user.institutionname!,
            },
          },
        }
        : {
          certificate: {
            ownerId: user.id,
          },
        },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        certificate: {
          select: {
            id: true,
            title: true,
          },
        },
        performedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    const activities = logs.map((log) => {
      let type = "view";
      let title = "Certificate Action";
      let description = "Activity recorded";
      let status = "info";

      switch (log.action) {
        case "CERTIFICATE_CREATED":
          type = "upload";
          title = "New Certificate Uploaded";
          description = `Uploaded ${log.certificate.title || "Untitled"}`;
          status = "success";
          break;
        case "CERTIFICATE_VERIFIED":
          type = "verify";
          title = "Certificate Verified";
          description = `Verified ${log.certificate.title || "Untitled"}`;
          status = "success";
          break;
        case "CERTIFICATE_REJECTED":
          type = "reject";
          title = "Certificate Rejected";
          description = `Rejected ${log.certificate.title || "Untitled"}`;
          status = "failed";
          break;
      }

      return {
        id: log.id,
        type,
        title,
        description,
        user: {
          name: log.performedBy.fullName || "Unknown User",
          initials: (log.performedBy.fullName || "U").substring(0, 2).toUpperCase(),
          avatar: undefined, // Add avatar logic if available
        },
        createdAt: log.createdAt,
        status,
        certificateId: log.certificate.id,
      };
    });

    return NextResponse.json({
      activities,
    });
  } catch (error) {
    console.error("Recent activity error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
