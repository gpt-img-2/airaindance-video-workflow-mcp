export type AiraindanceConfig = { appBaseUrl: string };

function parseBaseUrl(value: string | undefined) {
  const candidate = (value || "https://airaindance.video")
    .trim()
    .replace(/\/+$/, "");
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Airaindance base URL must use http or https.");
  }
  return url.toString().replace(/\/+$/, "");
}

export function loadConfig(): AiraindanceConfig {
  return { appBaseUrl: parseBaseUrl(process.env.AIRAINDANCE_BASE_URL) };
}
