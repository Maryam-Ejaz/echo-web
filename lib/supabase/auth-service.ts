// import { supabaseClient } from "@/lib/supabase/client";
// import { handleImageUpload } from "@/lib/supabase/storage-service";

// export const handleAnonymousLogin = async (name: string, imageFile: File) => {
//   const supabase = supabaseClient();
//   const imageUrl = await handleImageUpload(imageFile);
//   if (!imageUrl) return;

//   const { data, error } = await supabase.auth.signInAnonymously();
//   if (error) {
//     console.error("Error logging in anonymously:", error);
//     return;
//   }

//   if (data?.user) {
//     // Fetch the user’s current metadata
//     const { data: userData, error: userError } = await supabase.auth.getUser();
//     if (userError) {
//       console.error("Error fetching user data:", userError);
//       return;
//     }

//     console.log("Anonymous login successful, metadata updated:", data);
//       window.location.href = `${window.location.origin}/auth/callback`;

//     // const { error: metadataError } = await supabase.auth.updateUser({
//     //   data: { user_metadata: { name, imageUrl } },
//     // });

//     // if (metadataError) {
//     //   console.error("Error updating user metadata:", metadataError);
//     // } else {
//     //   console.log("Anonymous login successful, metadata updated:", data);
//     //   window.location.href = `${window.location.origin}/auth/callback`;
//     // }
//   }
// };

import { supabaseClient } from "@/lib/supabase/client";
import { handleImageUpload } from "@/lib/supabase/storage-service";

export const handleAnonymousLogin = async (name: string, imageFile: File | null) => {
  const supabase = supabaseClient();
  
  // Set default values if name or imageFile is not provided
  const defaultName = "user";
  const defaultImageUrl = "/echo-logo.png"; // Public URL for default image

  let imageUrl: string = defaultImageUrl;

  // If imageFile is provided, try uploading it
  if (imageFile) {
    try {
      imageUrl = await handleImageUpload(imageFile)? "":"/echo-logo.png";
    } catch (error) {
      console.error("Image upload failed:", error);
      // Default image URL will be used in case of upload failure
    }
  }

  // Use default name if no name is provided
  const userName = name.trim() === "" ? defaultName : name;

  try {
    // Perform anonymous sign-in
    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError) {
      console.error("Error logging in anonymously:", signInError.message);
    } else if (signInData?.user) {
      try {
        // Try updating user metadata
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { user_metadata: { name: userName, imageUrl } },
        });
        if (metadataError) {
          console.error("Error updating user metadata:", metadataError.message);
        } else {
          console.log("Anonymous login successful, metadata updated:", signInData);
        }
      } catch (error) {
        console.error("Error updating user metadata:", error);
      }
    }
  } catch (error) {
    console.error("Error logging in anonymously:", error);
  }

  // Redirect regardless of the errors encountered
  window.location.href = "/"; // Adjust this as needed
};





export const handleLoginWithOAuth = async (provider: "google" | "github" | "discord") => {
    const supabase = supabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  
    if (error) {
      console.error("Error initiating OAuth login:", error.message);
      throw error;
    }
  };
