import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { CertificateStatus } from "@/app/generated/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await context.params;

    if (!hash) {
      return NextResponse.json(
        { valid: false, message: "Verification hash missing" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        verificationHash: hash,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        owner: {
          select: {
            fullName: true,
            email: true,
            institutionname: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          valid: false,
          message: "Invalid or tampered certificate",
        },
        { status: 404 }
      );
    }

    // ❌ Rejected certificates are invalid
    if (certificate.status === CertificateStatus.REJECTED) {
      return NextResponse.json({
        valid: false,
        status: certificate.status,
        message: "Certificate has been rejected",
      });
    }

    // ⚠️ Pending certificates
    if (certificate.status === CertificateStatus.PENDING) {
      return NextResponse.json({
        valid: false,
        status: certificate.status,
        message: "Certificate is pending verification",
      });
    }

    // ✅ Verified / Approved
    return NextResponse.json({
      valid: true,
      status: certificate.status,
      certificate: {
        title: certificate.title,
        description: certificate.description,
        issuedAt: certificate.createdAt,
        holderName: certificate.owner.fullName,
        institution: certificate.owner.institutionname,
      },
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { valid: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
