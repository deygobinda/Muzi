import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { streamClient, userClient } from "@/app/lib/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/utill";

const YT_API_KEY = process.env.YT_API_KEY;

const CreateStreamSchema = z.object({
  url: z.string(),
});

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const session = await getServerSession(authOptions)
    console.log(data)
    const match = data.url.match(YT_REGEX);
    const extractedID = match ? match[1] : null;
    if (!extractedID) {
      return NextResponse.json(
        {
          message: "Wrong URL format or Could not extract video ID",
        },
        {
          status: 411,
        }
      );
    }
    const yt_data = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${extractedID}&key=${YT_API_KEY}`
    );
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
    const title = yt_data.data.items[0].snippet.title;
    const sreams = await streamClient.create({
      data: {
        userId: user.id,
        url: data.url,
        extractedID,
        smallImg: `https://img.youtube.com/vi/${extractedID}/mqdefault.jpg`,
        bigImg: `https://img.youtube.com/vi/${extractedID}/sddefault.jpg`,
        title,
        type: "Youtube",
      },
    });
    return NextResponse.json({
      message: "Stream created",
      id: sreams.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Wrong URL format",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await streamClient.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    streams,
  });
}
