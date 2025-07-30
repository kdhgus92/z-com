import BackButton from "@/app/(afterLogin)/_component/BackButton";
import style from "./singlePost.module.css";
import CommentForm from "@/app/(afterLogin)/[username]/status/[id]/_component/CommentForm";
import SinglePost from "@/app/(afterLogin)/[username]/status/[id]/_component/SinglePost";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSinglePost } from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost";
import { getComments } from "@/app/(afterLogin)/[username]/status/[id]/_lib/getComments";
import Comments from "@/app/(afterLogin)/[username]/status/[id]/_component/Comments";
import { Metadata } from "next";
import { User } from "@/model/User";
import { Post } from "@/model/Post";
import { getUserServer } from "@/app/(afterLogin)/[username]/_lib/getUserServer";
import { getSinglePostServer } from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePostServer";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, id } = await params;
  const [user, post]: [User, Post] = await Promise.all([
    getUserServer({ queryKey: ["users", username] }),
    getSinglePostServer({ queryKey: ["posts", id] }),
  ]);
  return {
    title: `Z에서 ${user.nickname} 님 : ${post.content}`,
    description: post.content,
    openGraph: {
      title: `Z에서 ${user.nickname} 님 : ${post.content}`,
      description: post.content,
      images:
        post.Images?.length > 0
          ? post.Images?.map((v) => ({
              url: `http://localhost:3000${v.link}`, // /upload
              width: 600,
              height: 400,
            }))
          : [
              {
                url: `http://localhost:3000${user.image}`, // /upload
                width: 800,
                height: 600,
              },
            ],
    },
  };
}

type Props = {
  params: Promise<{ id: string; username: string }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", id],
    queryFn: getSinglePostServer,
  });

  await queryClient.prefetchQuery({
    queryKey: ["posts", id, "comments"],
    queryFn: getComments,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>게시하기</h3>
        </div>
        <SinglePost id={id} />
        <CommentForm id={id} />
        <div>
          <Comments id={id} />
        </div>
      </HydrationBoundary>
    </div>
  );
}
