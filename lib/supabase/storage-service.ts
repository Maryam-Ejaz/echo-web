import { supabaseClient } from "@/lib/supabase/client";

export const handleImageUpload = async (file: File): Promise<string | null> => {
  const supabase = supabaseClient();
  const fileName = `folder/${Date.now()}_${file.name}`;

  // Upload the file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      cacheControl: '3600', 
      upsert: false
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError.message);
    return null;
  }

  // Retrieve the public URL of the uploaded file
  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
