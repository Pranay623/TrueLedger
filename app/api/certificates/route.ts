import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CertificateStatus } from "@/app/generated/prisma";

/* ---------------- CREATE CERTIFICATE ---------------- */
export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) return auth.error;

    const user = auth.user;
    const body = await req.json();

    const {
      title,
      description,
      fileUrl,
      fileType,
      s3Key,
    } = body;

    if (!title || !fileUrl || !fileType || !s3Key) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        fileUrl,
        fileType,
        s3Key,
        ownerId: user.id,
        status: CertificateStatus.PENDING,
      },
    });

    // ✅ Activity log
    await prisma.certificateLog.create({
      data: {
        certificateId: certificate.id,
        action: "CERTIFICATE_CREATED",
        performedById: user.id,
        metadata: {
          fileType,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Certificate created successfully",
        certificate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create certificate error:", error);
    return NextResponse.json(
      { message: "Failed to create certificate" },
      { status: 500 }
    );
  }
}

/* ---------------- LIST USER CERTIFICATES ---------------- */
export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) return auth.error;

    const user = auth.user;
    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {
      ownerId: user.id,
    };

    if (
      status &&
      Object.values(CertificateStatus).includes(
        status as CertificateStatus
      )
    ) {
      where.status = status;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
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
    console.error("Get certificates error:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
