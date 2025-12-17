import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serialize } from "cookie";
import crypto from "crypto";

export async function POST() {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const user = authResult.user;

    // 🔁 Rotate securityId → invalidates ALL refresh tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        securityId: crypto.randomUUID(),
      },
    });

    const response = NextResponse.json({
      message: "Logged out from all sessions",
    });

    response.headers.append(
      "Set-Cookie",
      serialize("accessToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("refreshToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      })
    );

    return response;
  } catch (error) {
    console.error("Logout all error:", error);
    return NextResponse.json(
      { message: "Failed to logout from all sessions" },
      { status: 500 }
    );
  }
}
