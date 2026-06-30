import { readFile } from "fs/promises";
import path from "path";

export async function readProjectEnv() {
  const envPath = path.resolve(process.cwd(), "..", ".env");
  const content = await readFile(envPath, "utf8");

  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index);
        const value = line.slice(index + 1).replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}
