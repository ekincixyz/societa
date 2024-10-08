import { NeynarFeedList } from "@/components/Neynar";
import Link from "next/link";

export default async function Page({
  params: { channelId },
}: {
  params: { channelId: string };
}) {
  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-gray-800 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{channelId}</h1>
          </div>
          <nav className="mt-10 space-y-4">
            <Link
             href="/"
              className="flex items-center gap-3 text-lg hover:text-purple-400"
            >
              <span>Home</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{channelId}</h1>
        </header>
        <NeynarFeedList
          feedType="filter"
          channelId={channelId}
          viewerFid={2}
          limit={50}
          filterType="channel_id"
        />
      </main>
    </div>
  );
}
