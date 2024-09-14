import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { writeFile } from "fs/promises";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  // const prompt = formData.get("prompt") as string;

  if (!image) {
    return NextResponse.json({ error: "no data provided" }, { status: 400 });
  }

  console.log("received: ", image?.name);
  console.log(image?.size + "bytes");

  const redirectUrl = request.nextUrl.clone();

  // if (prompt) {
  //   redirectUrl.pathname = "/";
  //   redirectUrl.searchParams.append("prompt", prompt);
  //   console.log("redirecting to: ", redirectUrl.href);
  //   redirect(redirectUrl.href);
  // }

  // const buffer = await image.arrayBuffer();
  // const filename = `${uuidv4()}${path.extname(image.name)}`;
  // const filepath = path.join("/tmp", filename);

  // await writeFile(filepath, Buffer.from(buffer));

  redirectUrl.pathname = `/`;
  redirectUrl.searchParams.append("prompt", "you should have had an image");
  console.log("redirecting to: ", redirectUrl.href);
  redirect(redirectUrl.href);
}
