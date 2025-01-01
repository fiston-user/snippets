import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || typeof session.user.id !== "string") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const snippets = await prisma.snippet.findMany({
      where: {
        authorId: session.user.id,
      },
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
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error("[SNIPPETS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
