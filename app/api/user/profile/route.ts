import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = updateProfileSchema.parse(json);

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: body.name },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
