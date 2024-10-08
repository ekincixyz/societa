"use client";

import { NeynarAuthButton, NeynarFeedList, useNeynarContext } from "@neynar/react";
import { useEffect, useState } from "react";
import { SOLANA_CHANNELS } from "./consts/channels"
import Link from "next/link";

export default function Home() {
  const { user } = useNeynarContext();
  const [channels, setChannels] = useState<{ channels: { id: string, name: string, image_url: string }[] } | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [castText, setCastText] = useState("");

  const fetchChannels = async () => {
    const channels = SOLANA_CHANNELS.join(',');

    const response = await fetch(`/api/bulkChannels?channels=${channels}`);
    const data = await response.json();
    setChannels(data);
  };

  useEffect(() => {
    if (!channels) fetchChannels();
  }, [channels]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChannel(event.target.value);
  };

  const submitCast = async () => {
    if (user && user.signer_uuid) {
      const response = await fetch("/api/casts", {
        method: "POST",
        body: JSON.stringify({
          signer: user.signer_uuid,
          text: castText,
          channelId: selectedChannel,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        closeModal();
        setCastText("");
        setSelectedChannel("");
      }
    }
  }

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-gray-800 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Farcaster</h1>
            <button
              className="bg-purple-600 px-4 py-2 rounded-lg"
              onClick={openModal}
            >
              Cast
            </button>
          </div>
          <nav className="mt-10 space-y-4">
            <NeynarAuthButton className="right-4 top-4" />
            {channels?.channels && channels.channels.length > 0 ? (
              channels.channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/channel/${encodeURIComponent(channel.name)}`}
                  className="flex items-center gap-3 text-lg hover:text-purple-400"
                >
                  <img src={channel.image_url} alt={channel.name} className="w-10 h-10 rounded-full" />
                  <span>{channel.name}</span>
                </Link>
              ))
            ) : <></>
            }
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Home</h1>
          <input
            type="text"
            placeholder="Search Farcaster"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
          />
        </header>

        <div className="bg-gray-800 rounded-lg p-6 mb-4">
          <input
            type="text"
            placeholder="What's happening?"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          <NeynarFeedList
            feedType={user?.fid ? "following" : "filter"}
            fid={user?.fid}
            filterType="global_trending"
          />
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-2xl mb-4">Create a Cast</h2>

            {channels?.channels && <div className="mb-4">
              <label htmlFor="channelSelect" className="block text-sm font-medium mb-2">
                Select a Channel
              </label>
              <select
                id="channelSelect"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
                value={selectedChannel}
                onChange={handleChannelChange}
              >
                <option value="" disabled>Select a channel</option>
                {channels.channels.map((channel: any) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>

              {selectedChannel && (
                <div className="mt-4 flex items-center">
                  <img
                    src={channels.channels.find((ch: any) => ch.id === selectedChannel)?.image_url}
                    alt="Channel image"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <span>{channels.channels.find((ch: any) => ch.id === selectedChannel)?.name}</span>
                </div>
              )}
            </div>}

            <textarea
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none mb-4"
              placeholder="What's on your mind?"
              rows={5}
              value={castText}
              onChange={(e) => setCastText(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-600 px-4 py-2 rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button disabled={!castText || !user || !user.signer_uuid} className="bg-purple-600 px-4 py-2 rounded-lg" onClick={submitCast}>
                Cast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
