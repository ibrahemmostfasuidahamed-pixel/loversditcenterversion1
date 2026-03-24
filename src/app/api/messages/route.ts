import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const message = await prisma.message.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || "",
                message: data.message,
            },
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Message error:", error);
        return NextResponse.json(
            { error: "Failed to save message" },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(messages);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
