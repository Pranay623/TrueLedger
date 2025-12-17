
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        usertype: true,
        admin: true,
        institutionname: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;
    const body = await req.json();

    const updateData: any = {};

    // ✅ Anyone can update full name
    if (body.fullName) {
      updateData.fullName = body.fullName;
    }

    // 🔐 Only institution admins can update institution name
    if (body.institutionname) {
      if (user.usertype !== "INSTITUTION" || !(user as any).admin) {
        return NextResponse.json(
          { message: "Only institution admins can update institution name" },
          { status: 403 }
        );
      }
      updateData.institutionname = body.institutionname;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        institutionname: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
