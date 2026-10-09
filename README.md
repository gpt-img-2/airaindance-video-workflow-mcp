# Airaindance Video Workflow MCP

Deterministic, read-only MCP tools and an OpenClaw Skill for planning original short-form videos inspired by the Raindance social-video trend. Build a visual brief, lay out an 11-beat storyboard, check prompt and rights risks, and find canonical Airaindance pages.

This toolkit only transforms text supplied by the user. It does not inspect or upload photos, generate or submit a video, call an AI provider, access an account, or spend credits. It does not reproduce an existing performance, choreography, frames, lyrics, or recording. Airaindance is independent and is not affiliated with Dave, Tems, TikTok, Instagram, or their rights holders.

## Install

```bash
npx -y github:gpt-img-2/airaindance-video-workflow-mcp
```

## MCP tools

- `build_raindance_video_brief` — turn an original idea into a concise visual prompt with rights checks.
- `plan_raindance_storyboard` — create an 11-beat timed outline and check that timing adds up.
- `audit_raindance_prompt` — flag missing permissions and requests to copy protected creative work.
- `get_airaindance_resources` — return canonical public pages and the raw Skill URL.

The server is read-only and uses no network calls. Set `AIRAINDANCE_BASE_URL` only when testing against a non-default site origin.

## OpenClaw

```bash
openclaw mcp add airaindance-video \
  --command npx \
  --arg -y \
  --arg github:gpt-img-2/airaindance-video-workflow-mcp \
  --include 'build_raindance_video_brief,plan_raindance_storyboard,audit_raindance_prompt,get_airaindance_resources'
```

The standalone Skill is in [`openclaw/raindance-video-storyboard-director/SKILL.md`](openclaw/raindance-video-storyboard-director/SKILL.md).

## Development

```bash
pnpm install
pnpm validate
```

Canonical product information: [airaindance.video/llms.txt](https://airaindance.video/llms.txt).
