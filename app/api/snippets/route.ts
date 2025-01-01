import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";
import { Prisma } from "@prisma/client";

const createSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(2000),
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Language is required"),
  framework: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  isPublic: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    console.log("Received data:", json);

    let body;
    try {
      body = createSnippetSchema.parse(json);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      if (validationError instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(validationError.issues), {
          status: 422,
        });
      }
      throw validationError;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const snippet = await prisma.snippet.create({
      data: {
        ...body,
        authorId: user.id,
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
    });

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Error creating snippet:", error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const framework = searchParams.get("framework");
    const language = searchParams.get("language");

    const where: Prisma.SnippetWhereInput = {
      isPublic: true,
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
      ...(category && { category }),
      ...(framework && { framework }),
      ...(language && { language }),
    };

    const snippets = await prisma.snippet.findMany({
      where,
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
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}
