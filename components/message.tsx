import { Imessage, useMessage } from "@/lib/store/messages";
import React from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useUser } from "@/lib/store/user";

const Message = ({ message }: { message: Imessage }) => {
  const user = useUser((state) => state.user);
  const displayName = message.users?.display_name || "Unknown";
  const avatarUrl = message.users?.avatar_url || "";
  const createdAt = new Date(message.created_at);
  const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = createdAt.toLocaleDateString();

  
  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={avatarUrl}
          alt={displayName}
          width={40}
          height={40}
          className="rounded-lg shadow-xl"
        />
      </div>
      <div className="flex-1 overflow-x-hidden">
        <div className="flex items-start justify-between gap-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-regular">{displayName}</h1>
              <h1 className="text-xs text-secondary-foreground">
                {formattedDate} {formattedTime}
              </h1>
              {message.is_edit && (
                <h1 className="text-xs text-secondary-foreground">edited</h1>
              )}
            </div>
          </div>
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="break-words font-medium rounded-bl-3xl w-fit">
          {message.text}
        </p>
      </div>
    </div>
  );
};

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage((state) => state.setActionMessage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Message;
