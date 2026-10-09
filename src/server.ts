import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { loadConfig } from "./config.js";
import {
  auditRaindancePrompt,
  buildRaindanceVideoBrief,
  getAiraindanceResources,
  planRaindanceStoryboard,
} from "./toolkit.js";

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const instructions = "Airaindance Video Workflow MCP provides deterministic, read-only text planning. It does not inspect or upload media, generate or submit videos, call providers, access accounts, or spend credits. Require permission for reference photos and consent from depicted people. Keep concepts original; never reproduce a specific performance, choreography, frames, lyrics, or recording. Use only separately licensed audio, and check current product availability and terms at the linked site.";
const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});

export function createServer() {
  const config = loadConfig();
  const server = new McpServer(
    { name: "airaindance-video-workflow-mcp", version: "1.0.0" },
    { instructions },
  );

  server.registerTool(
    "build_raindance_video_brief",
    {
      title: "Build an original Raindance-trend video brief",
      description:
        "Draft a visual-only reveal-and-reunion concept with explicit photo permission, likeness consent, originality, and audio checks.",
      inputSchema: z.object({
        storyPremise: z.string().min(1).max(1200),
        subjectRoles: z.array(z.string().min(1).max(300)).min(1).max(4),
        visualMotif: z.string().max(500).optional(),
        mood: z.string().max(300).optional(),
        ending: z.string().max(500).optional(),
        photoRightsConfirmed: z.boolean(),
        depictedPeopleConsentConfirmed: z.boolean(),
        originalStoryConfirmed: z.boolean(),
        audioPlan: z.enum(["silent", "licensed-audio-added-later"]),
        audioRightsConfirmed: z.boolean(),
      }),
      annotations,
    },
    async (params) => text(buildRaindanceVideoBrief(params)),
  );

  server.registerTool(
    "plan_raindance_storyboard",
    {
      title: "Plan an 11-beat Raindance-trend storyboard",
      description:
        "Divide a user-selected duration into 11 original reveal-to-reunion visual beats and preserve a personal motif.",
      inputSchema: z.object({
        durationSeconds: z.number().positive().max(90),
        aspectRatio: z.enum(["4:3", "9:16", "16:9", "1:1"]),
        personalDetail: z.string().max(500).optional(),
      }),
      annotations,
    },
    async (params) => text(planRaindanceStoryboard(params)),
  );

  server.registerTool(
    "audit_raindance_prompt",
    {
      title: "Audit a Raindance-trend prompt",
      description:
        "Check text for missing rights confirmations and wording that may request copied creative work or unlicensed audio.",
      inputSchema: z.object({
        prompt: z.string().max(20_000),
        photoRightsConfirmed: z.boolean(),
        depictedPeopleConsentConfirmed: z.boolean(),
        originalStoryConfirmed: z.boolean(),
        audioRightsConfirmed: z.boolean(),
      }),
      annotations,
    },
    async (params) => text(auditRaindancePrompt(params)),
  );

  server.registerTool(
    "get_airaindance_resources",
    {
      title: "Get Airaindance resources",
      description:
        "Return canonical product, examples, trend, pricing, and policy URLs without fetching external content.",
      inputSchema: z.object({
        topic: z.enum(["all", "create", "examples", "trend", "pricing", "policy"]).default("all"),
      }),
      annotations,
    },
    async ({ topic }) =>
      text({
        topic,
        resources: getAiraindanceResources(config.appBaseUrl, topic),
        rawSkillUrl: `${config.appBaseUrl}/skills/raindance-video-storyboard-director/SKILL.md`,
        mcpSource: "https://github.com/gpt-img-2/airaindance-video-workflow-mcp",
      }),
  );

  return server;
}
