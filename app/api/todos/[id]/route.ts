import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numId = Number(id);

    if (Number.isNaN(numId)) {
      return new NextResponse("Invalid id", { status: 400 });
    }

    const todo = await prisma.todo.findUnique({ where: { id: numId } });
    if (!todo) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("[GET /api/todos/:id] error:", error);
    return new NextResponse("Failed to fetch todo", { status: 500 });
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numId = Number(id);

    if (Number.isNaN(numId)) {
      return new NextResponse("Invalid id", { status: 400 });
    }

    const body = await req.json();
    const { title, content, status } = body;

    const todo = await prisma.todo.update({
      where: { id: numId },
      data: { title, content, status },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("[PUT /api/todos/:id] error:", error);
    return new NextResponse("Failed to update todo", { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const numId = Number(id);

    if (Number.isNaN(numId)) {
      return new NextResponse("Invalid id", { status: 400 });
    }

    await prisma.todo.delete({ where: { id: numId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/todos/:id] error:", error);
    return new NextResponse("Failed to delete todo", { status: 500 });
  }
}
