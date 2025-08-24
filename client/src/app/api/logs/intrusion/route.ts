import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { LogEntry } from "../../../../../lib/types";

export async function GET() {
  try {
    const logPath = path.join("C:/integrity", "intrusion_log.txt");

    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }

    // Read file in chunks
    const logContent = await new Promise<string>((resolve, reject) => {
      const chunks: string[] = [];
      const stream = fs.createReadStream(logPath, { encoding: "utf-8" });

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(chunks.join("")));
      stream.on("error", reject);
    });

    const logs: LogEntry[] = [];
    const entries = logContent
      .trim()
      .split("\n\n")
      .filter((entry) => entry.trim() !== "");

    for (const entry of entries) {
      try {
        const lines = entry.split("\n");
        logs.push({
          id: `intrusion-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          event: lines[0]?.trim() || "Unknown Event",
          timestamp: new Date().toISOString(),
          details: lines.slice(1).join("\n").trim() || "No details available",
        });
      } catch (entryError) {
        console.error("Error processing log entry:", entryError);
        continue;
      }
    }

    return NextResponse.json(logs.reverse());
  } catch (error) {
    console.error("Intrusion Logs API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch intrusion logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
