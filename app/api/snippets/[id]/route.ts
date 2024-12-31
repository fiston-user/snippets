import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!snippet) {
      return new NextResponse("Snippet not found", { status: 404 });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return new NextResponse(null, { status: 500 });
  }
}
