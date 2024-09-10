import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

export default async function SharePreview({
  params,
}: {
  params: { filename: string };
}) {
  const { filename } = params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    await fs.access(filepath);
  } catch {
    redirect("/?message=image-not-found");
  }

  const handleUpload = async () => {
    "use server";
    try {
      // Implement your upload logic here
      // For example, upload to a cloud storage service
      await uploadToCloudStorage(filepath);

      // After successful upload, delete the local file
      await fs.unlink(filepath);

      // Redirect to a success page or home
      revalidatePath("/");
      redirect("/");
    } catch (error) {
      console.error("Error during upload:", error);
      // Handle error (e.g., redirect to an error page)
      toast.error(
        "Something went wrong. Please try again or use a different image"
      );
    }
  };

  const handleDiscard = async () => {
    "use server";
    await fs.unlink(filepath);
    // Redirect to home or another appropriate page
    redirect("/");
  };

  return (
    <div className="container flex flex-col items-center pt-16 px-8 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shared Image Preview</h1>
      <div className="mb-4">
        <Image
          src={`/uploads/${filename}`}
          alt="Shared image"
          width={400}
          height={400}
        />
      </div>
      <form className="flex space-x-6">
        <Button className="w-[120px]" onClick={handleUpload}>
          Upload
        </Button>
        <Button className="w-[120px]" onClick={handleDiscard}>
          Discard
        </Button>
      </form>
    </div>
  );
}

// This function is a placeholder. Implement your actual upload logic here.
async function uploadToCloudStorage(filepath: string) {
  // Simulate an upload process
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("File uploaded:", filepath);
}
