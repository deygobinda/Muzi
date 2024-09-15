import { upvoteClient, userClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
  sreamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  
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
  try{
    const data = upvoteSchema.parse(await req.json());
    await upvoteClient.create({
        data : {
            userId : user.id,
            streamId : data.sreamId
        }
    })
  }catch(e){
    return NextResponse.json(
        {  
          message: "Error while upvotin",
        },
        {
          status: 403,
        }
      );
  }
}
