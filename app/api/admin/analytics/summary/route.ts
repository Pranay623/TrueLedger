import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin , PermissionCheckUser} from "@/app/lib/permissions";
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

    const counts = await prisma.certificate.groupBy({
      by: ["status"],
      where: {
        owner: {
          institutionname: institution,
        },
      },
      _count: true,
    });

    let total = 0;
    let approved = 0;
    let rejected = 0;
    let pending = 0;
    let verified = 0;

    for (const row of counts) {
      total += row._count;

      if (row.status === CertificateStatus.APPROVED) approved = row._count;
      if (row.status === CertificateStatus.REJECTED) rejected = row._count;
      if (row.status === CertificateStatus.PENDING) pending = row._count;
      if (row.status === CertificateStatus.VERIFIED) verified = row._count;
    }

    const successRate =
      total === 0
        ? 0
        : Number(
            (((approved + verified) / total) * 100).toFixed(2)
          );

    return NextResponse.json({
      totalCertificates: total,
      pending,
      approved,
      rejected,
      verified,
      successRate,
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      { message: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
