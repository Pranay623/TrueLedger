import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logged out successfully",
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
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
