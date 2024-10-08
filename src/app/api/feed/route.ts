import neynarClient from "@/lib/neynarClient";
import { FeedTrendingProvider } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    // THIS THROWS ERROR IF INCLUDED
    //   const metadata = encodeURIComponent(JSON.stringify({
    //     "feed_id": 'feed_75',
    //     "user_id": "9084",
    //     "return_metadata": true,
    //     "top_k": 10,
    //  }))

    const feed = await neynarClient.fetchTrendingFeed(
      {
        limit: 10,
        provider: FeedTrendingProvider.Mbd,
      }
    )

    return NextResponse.json(feed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
};
