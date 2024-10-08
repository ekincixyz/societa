import neynarClient from "@/lib/neynarClient";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("channels")?.split(",");

    if (!ids) {
      return NextResponse.json(
        { error: "No channel ids provided" },
        { status: 400 },
      );
    }

    const channels = await neynarClient.fetchBulkChannels(ids);

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
};
