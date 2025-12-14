import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CertificateStatus } from "@/app/generated/prisma";

export async function POST(req: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;
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
        title,
        description,
        fileUrl,
        fileType,
        s3Key,
        ownerId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Certificate created", certificate },
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


export async function GET(req: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {
      ownerId: user.id,
    };

    if (status && Object.values(CertificateStatus).includes(status as CertificateStatus)) {
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