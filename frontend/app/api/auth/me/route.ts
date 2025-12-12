import { NextResponse } from "next/server";

export async function GET() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
    try {
        const res = await fetch(`${backendUrl}/auth/me`, {
            credentials: "include",
        });
        if (!res.ok) {
            return NextResponse.json({ user: null }, { status: res.status });
        }
        const user = await res.json();
        return NextResponse.json({ user }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
