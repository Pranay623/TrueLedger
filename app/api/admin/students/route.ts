import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isInstitutionAdmin, PermissionCheckUser } from "@/app/lib/permissions";
import { Role } from "@/app/generated/prisma";

export async function GET(req: Request) {
    try {
        const authResult = await requireAuth();
        if ("error" in authResult) return authResult.error;

        const admin = authResult.user as unknown as PermissionCheckUser;

        // 1. Verify Admin Access
        if (!isInstitutionAdmin(admin)) {
            return NextResponse.json(
                { message: "Institution Admin access required" },
                { status: 403 }
            );
        }

        const institutionName = admin.institutionname;

        if (!institutionName) {
            return NextResponse.json(
                { message: "Institution profile incomplete" },
                { status: 400 }
            );
        }

        // 2. Fetch Students
        const students = await prisma.user.findMany({
            where: {
                usertype: Role.STUDENT,
                institutionname: institutionName,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                username: true,
                createdAt: true,
                avatar: true,
                _count: {
                    select: { certificates: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            data: students,
            count: students.length,
        });
    } catch (error) {
        console.error("Fetch students error:", error);
        return NextResponse.json(
            { message: "Failed to fetch students" },
            { status: 500 }
        );
    }
}
