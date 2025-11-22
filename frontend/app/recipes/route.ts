import { NextResponse } from "next/server";

export async function GET() {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        return NextResponse.json({ error: "Missing BACKEND_URL" }, { status: 500 });
    }

    try {
        const res = await fetch(`${backendUrl}/recipes`, { cache: "no-store" });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch recipes" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("Backend fetch failed:", err);
        return NextResponse.json({ error: "Backend request failed" }, { status: 500 });
    }
}
