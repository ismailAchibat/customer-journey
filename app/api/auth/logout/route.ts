import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json({ message: "Logout successful" });

    // Instruct the browser to delete the session cookie
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Set expiry date to the past
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
