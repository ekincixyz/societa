import neynarClient from "@/lib/neynarClient";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { signer, text, channelId } = await req.json();

    const cast = await neynarClient.publishCast(signer, text, {
      channelId,
    })

    return NextResponse.json(cast, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
};
