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

  if (prompt) {
    console.log("redirecting to homepage", request.url);
    return NextResponse.redirect(new URL(`/?prompt=${prompt}`, request.url));
  }

  const buffer = await image.arrayBuffer();
  const filename = `${uuidv4()}${path.extname(image.name)}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filepath, Buffer.from(buffer));

  const redirectUrl = `/share-preview/${filename}`;
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
