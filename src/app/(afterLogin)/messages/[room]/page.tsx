import style from "./chatRoom.module.css";
import cx from "classnames";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { auth } from "@/auth";
import { QueryClient } from "@tanstack/react-query";
import { getUserServer } from "@/app/(afterLogin)/[username]/_lib/getUserServer";
import { UserInfo } from "@/app/(afterLogin)/messages/[room]/_component/UserInfo";
import MessageForm from "@/app/(afterLogin)/messages/[room]/_component/MessageForm";
import WebSocketComponet from "@/app/(afterLogin)/messages/[room]/_component/WebSocketComponent";
import MessageList from "@/app/(afterLogin)/messages/[room]/_component/MessageList";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  params: { room: string };
};
export default async function ChatRoom({ params }: Props) {
  const session = await auth();
  const queryClient = new QueryClient();

  // 상대방 ID
  const ids = params.room.split("-").filter((v) => v !== session?.user?.email);

  if (!ids[0]) {
    return null;
  }

  // 상대방 정보 쿼리
  await queryClient.prefetchQuery({
    queryKey: ["users", ids[0]],
    queryFn: getUserServer,
  });

  const messages = [
    {
      messageId: 1,
      roomId: 123,
      id: "zerohch0",
      content: "안녕하세요.",
      createdAt: new Date(),
    },
    {
      messageId: 2,
      roomId: 123,
      id: "hero",
      content: "안녕히가세요.",
      createdAt: new Date(),
    },
  ];

  return (
    <main className={style.main}>
      <WebSocketComponet />
      <UserInfo id={ids[0]} />
      <MessageList id={ids[0]} />
      <MessageForm id={ids[0]} />
    </main>
  );
}
