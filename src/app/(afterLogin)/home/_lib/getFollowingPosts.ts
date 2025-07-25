export async function getFollowingPosts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/followings`,
    {
      next: {
        tags: ["posts", "followings"],
      },
      credentials: "include",
      cache: "force-cache",
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // this will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
