import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Role } from "@/app/generated/prisma";

export async function GET(req: Request) {
    try {
        const authResult = await requireAuth();
        if ("error" in authResult) return authResult.error;

        const user = authResult.user;

        // 1. Check if user is a student
        if (user.usertype !== Role.STUDENT) {
            return NextResponse.json(
                { message: "Access restricted to students" },
                { status: 403 }
            );
        }

        const institutionName = user.institutionname;

        if (!institutionName) {
            return NextResponse.json(
                { message: "You are not linked to an institution" },
                { status: 404 }
            );
        }

        // 2. Fetch Institution Admin info
        // We assume the institution has an admin account with the matching institutionname
        const admin = await prisma.user.findFirst({
            where: {
                institutionname: institutionName,
                usertype: Role.INSTITUTION,
                admin: true // Fetch the main admin
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                institutionname: true,
                createdAt: true,
            }
        });

        if (!admin) {
            // Fallback if no admin is specifically marked, try to list any institution user? 
            // Or just return the institution name we already have.
            return NextResponse.json({
                institutionName,
                admin: null,
                message: "Institution admin not found"
            });
        }

        return NextResponse.json({
            institutionName,
            admin
        });
    } catch (error) {
        console.error("Fetch institution details error:", error);
        return NextResponse.json(
            { message: "Failed to fetch institution details" },
            { status: 500 }
        );
    }
}
