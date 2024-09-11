import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const prompt = formData.get("prompt") as string;

  console.log("received: ", prompt, image?.name);

  if (!prompt && !image) {
    return NextResponse.json({ error: "no data provided" }, { status: 400 });
  }

  const redirectUrl = new URL(request.nextUrl.host);

  if (prompt) {
    redirectUrl.searchParams.append("prompt", prompt);
    console.log("redirecting to: ", redirectUrl.href);
    return NextResponse.redirect(redirectUrl.href);
  }

  const buffer = await image.arrayBuffer();
  const filename = `${uuidv4()}${path.extname(image.name)}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filepath, Buffer.from(buffer));

  redirectUrl.pathname = `/share-preview/${filename}`;
  console.log("redirecting to: ", redirectUrl.href);
  return NextResponse.redirect(redirectUrl.href);
}
