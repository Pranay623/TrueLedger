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

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      pending,
      approved,
      rejected,
      verified,
      todayCount,
      monthCount,
    ] = await Promise.all([
      prisma.certificate.count({
        where: { owner: { institutionname: institution } },
      }),
      prisma.certificate.count({
        where: {
          status: CertificateStatus.PENDING,
          owner: { institutionname: institution },
        },
      }),
      prisma.certificate.count({
        where: {
          status: CertificateStatus.APPROVED,
          owner: { institutionname: institution },
        },
      }),
      prisma.certificate.count({
        where: {
          status: CertificateStatus.REJECTED,
          owner: { institutionname: institution },
        },
      }),
      prisma.certificate.count({
        where: {
          status: CertificateStatus.VERIFIED,
          owner: { institutionname: institution },
        },
      }),
      prisma.certificate.count({
        where: {
          createdAt: { gte: startOfToday },
          owner: { institutionname: institution },
        },
      }),
      prisma.certificate.count({
        where: {
          createdAt: { gte: startOfMonth },
          owner: { institutionname: institution },
        },
      }),
    ]);

    return NextResponse.json({
      institution,
      stats: {
        totalCertificates: total,
        pending,
        approved,
        rejected,
        verified,
        uploadedToday: todayCount,
        uploadedThisMonth: monthCount,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
