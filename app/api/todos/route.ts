import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error("[GET /api/todos] error:", error);
    return new NextResponse("Failed to fetch todos", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, status } = body;

    if (!title || typeof title !== "string" || title.length > 50) {
      return new NextResponse("Invalid title", { status: 400 });
    }
    if (!content || typeof content !== "string" || content.length > 100) {
      return new NextResponse("Invalid content", { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        content,
        status: status ?? "NOT_STARTED",
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("[POST /api/todos] error:", error);
    return new NextResponse("Failed to create todo", { status: 500 });
  }
}
