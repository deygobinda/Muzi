import { upvoteClient, userClient } from "@/app/lib/db";
import { authOptions } from "@/app/lib/utill";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const upvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Todo : Replace this with id everywhere
  const user = await userClient.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }
  console.log(user.id);
  try {
    const data = upvoteSchema.parse(await req.json());
    const upvote = await upvoteClient.findFirst({
      where: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    if (upvote) {
      return NextResponse.json({
        message: "Can not revote",
      });
    }

    await upvoteClient.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });
    return NextResponse.json({
      message: "success",
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while upvoting",
      },
      {
        status: 403,
      }
    );
  }
}
