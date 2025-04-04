// src/app/profile/[username]/page.tsx

import { getProfileByUsername, getUserPosts, getUserLikedPosts, isFollowing } from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

// Update generateMetadata to handle params as a Promise
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params; // Await the params Promise
  const user = await getProfileByUsername(resolvedParams.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

// Update ProfilePageServer to handle params as a Promise
async function ProfilePageServer({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params; // Await the params Promise
  const user = await getProfileByUsername(resolvedParams.username);

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;