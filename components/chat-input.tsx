"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Import the send icon

const ChatInput = () => {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = supabaseClient();
  
  const [text, setText] = useState<string>(""); // State for input text

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const id = uuidv4();
      const newMessage = {
        id,
        text,
        sent_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
        },
      };
      addMessage(newMessage as Imessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase.from("messages").insert({ text, id });
      if (error) {
        toast.error("Sorry, this message couldn't be delivered.");
      }
    } else {
      toast.error("Message cannot be empty!!");
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="relative">
        <Textarea
          className="resize-none w-full pr-10"
          placeholder="Send Message 💬"
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              handleSendMessage(text);
              setText(""); 
            }
          }}
        />
        <button
          className={`absolute right-3 bottom-3 ${
            !text.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (text.trim()) {
              handleSendMessage(text);
              setText(""); 
            }
          }}
          disabled={!text.trim()} 
        >
          <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
