import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin, PermissionCheckUser } from "@/app/lib/permissions";
import { CertificateStatus } from "@/app/generated/prisma";

export async function GET() {
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

    const institution = admin.institutionname!;
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    const certificates = await prisma.certificate.findMany({
      where: {
        owner: {
          institutionname: institution,
        },
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        status: true,
        createdAt: true,
      },
    });

    const trendMap: Record<string, any> = {};

    for (const cert of certificates) {
      const monthKey = cert.createdAt.toISOString().slice(0, 7); // YYYY-MM

      if (!trendMap[monthKey]) {
        trendMap[monthKey] = {
          month: monthKey,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          verified: 0,
        };
      }

      trendMap[monthKey].total++;

      switch (cert.status) {
        case CertificateStatus.APPROVED:
          trendMap[monthKey].approved++;
          break;
        case CertificateStatus.REJECTED:
          trendMap[monthKey].rejected++;
          break;
        case CertificateStatus.PENDING:
          trendMap[monthKey].pending++;
          break;
        case CertificateStatus.VERIFIED:
          trendMap[monthKey].verified++;
          break;
      }
    }

    const result = Object.values(trendMap).sort(
      (a: any, b: any) => a.month.localeCompare(b.month)
    );

    return NextResponse.json({ months: result });
  } catch (error) {
    console.error("Analytics trends error:", error);
    return NextResponse.json(
      { message: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
