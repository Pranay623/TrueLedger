import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { CertificateStatus } from "@/app/generated/prisma";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;

    const baseWhere: any = {};

    // 🔐 Role-based scoping
    if (user.usertype === "STUDENT") {
      baseWhere.ownerId = user.id;
    }

    if (user.usertype === "INSTITUTION") {
      baseWhere.owner = {
        institutionname: user.institutionname!,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalCertificates,
      verifiedToday,
      successfulCertificates,
      pendingReviews,
      failedVerifications,
    ] = await Promise.all([
      prisma.certificate.count({ where: baseWhere }),

      prisma.certificate.count({
        where: {
          ...baseWhere,
          status: CertificateStatus.VERIFIED,
          createdAt: { gte: today },
        },
      }),

      prisma.certificate.count({
        where: {
          ...baseWhere,
          status: {
            in: [
              CertificateStatus.VERIFIED,
              CertificateStatus.APPROVED,
            ],
          },
        },
      }),

      prisma.certificate.count({
        where: {
          ...baseWhere,
          status: CertificateStatus.PENDING,
        },
      }),

      prisma.certificate.count({
        where: {
          ...baseWhere,
          status: CertificateStatus.REJECTED,
        },
      }),
    ]);

    const successRate =
      totalCertificates === 0
        ? 0
        : Math.round((successfulCertificates / totalCertificates) * 100);

    return NextResponse.json({
      totalCertificates,
      verifiedToday,
      successRate,
      pendingReviews,
      failedVerifications,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { message: "Failed to load stats" },
      { status: 500 }
    );
  }
}
