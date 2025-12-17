import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CertificateStatus } from "@/app/generated/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin,PermissionCheckUser } from "@/app/lib/permissions";


export async function GET(req: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const admin = authResult.user as unknown as PermissionCheckUser;

    if (!isInstitutionAdmin(admin)) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    const where = {
      status: CertificateStatus.PENDING,
      owner: {
        institutionname: admin.institutionname!,
      },
    };

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: {
          owner: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.certificate.count({ where }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: certificates,
    });
  } catch (error) {
    console.error("Pending certificates error:", error);
    return NextResponse.json(
      { message: "Failed to fetch pending certificates" },
      { status: 500 }
    );
  }
}
