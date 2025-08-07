/* eslint-disable @typescript-eslint/no-explicit-any */

export function parseSessionText(text: string): any {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
  const result: any = {};

  let currentSection = "";

  for (const line of lines) {
    if (line.startsWith("Session data:")) {
      const match = line.match(/From (.*) to (.*)/);
      if (match) {
        result["Session start"] = match[1].trim();
        result["Session end"] = match[2].trim();
      }
    } else if (line.startsWith("Session:")) {
      result["Session length"] = line.replace("Session:", "").trim();
    } else if (line.includes(":") && !line.endsWith(":")) {
      const [key, value] = line.split(":").map((s) => s.trim());
      result[key] = value;
    } else if (line.endsWith(":")) {
      currentSection = line.replace(":", "");
      if (currentSection === "Killed Monsters") {
        result["Killed Monsters"] = [];
      } else if (currentSection === "Looted Items") {
        result["Looted Items"] = [];
      }
    } else if (currentSection && line.match(/^\d+x\s+/)) {
      const match = line.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        const count = parseInt(match[1]);
        const name = match[2].trim();

        if (currentSection === "Killed Monsters") {
          result["Killed Monsters"].push({ Count: count, Name: name });
        } else if (currentSection === "Looted Items") {
          result["Looted Items"].push({ Count: count, Name: name });
        }
      }
    }
  }

  return result;
}