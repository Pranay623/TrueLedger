import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { serialize } from "cookie";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string;
      securityId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.securityId !== payload.securityId) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // 🔁 New access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        usertype: user.usertype,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🔁 Rotate refresh token (BEST PRACTICE)
    const newSecurityId = crypto.randomUUID();

    await prisma.user.update({
      where: { id: user.id },
      data: { securityId: newSecurityId },
    });

    const newRefreshToken = jwt.sign(
      { userId: user.id, securityId: newSecurityId },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Token refreshed",
    });

    response.headers.append(
      "Set-Cookie",
      serialize("accessToken", newAccessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 900,
        sameSite: "strict",
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
      })
    );

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
