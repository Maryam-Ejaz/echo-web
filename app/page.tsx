import ChatHeader from "@/components/chat-header";
import { supabaseServer } from "@/lib/supabase/server";
import InitUser from "@/lib/store/initUser";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import ChatAbout from "@/components/chat-about";

const Home = async () => {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();

  return (
    <>
      <div className="w-[100%] mx-auto h-screen">
        <div className="h-screen border rounded-xl flex flex-col relative shadow-2xl shadow-primary-foreground">
          <ChatHeader user={data.session?.user} />
          {data.session?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
};

export default Home;
