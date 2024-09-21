import { streamClient, userClient } from "@/app/lib/db";
import { authOptions } from "@/app/lib/utill";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  const session = await getServerSession(authOptions);
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
  const streams = await streamClient.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          userId: user.id,
        },
      },
    },
  });
  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      votes: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
    })),
  });
}
