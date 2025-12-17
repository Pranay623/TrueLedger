import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin, PermissionCheckUser } from "@/app/lib/permissions";
import { CertificateStatus } from "@/app/generated/prisma";

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
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {
      owner: {
        institutionname: admin.institutionname!,
      },
    };

    if (
      status &&
      Object.values(CertificateStatus).includes(status as CertificateStatus)
    ) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          owner: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          owner: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

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
    console.error("Admin certificate search error:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
