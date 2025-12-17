import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin } from "@/app/lib/permissions";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;


    const { id } = await context.params;
    const { reason } = await req.json();

    // 🔥 FETCH FULL USER FROM DB
    const admin = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        usertype: true,
        admin: true,
        institutionname: true,
      },
    });

     if (!admin) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }



    if (
      !isInstitutionAdmin({
        ...admin,
        institutionname: admin.institutionname === null ? undefined : admin.institutionname,
      })
    ) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json({
      message: "Certificate rejected",
      reason,
      certificate: updated,
    });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json(
      { message: "Rejection failed" },
      { status: 500 }
    );
  }
}
