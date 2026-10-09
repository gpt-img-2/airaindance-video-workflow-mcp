export type ResourceTopic =
  | "all"
  | "create"
  | "examples"
  | "trend"
  | "pricing"
  | "policy";

function clean(value: string | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function unique(values: string[]) {
  return [...new Set(values.map(clean).filter(Boolean))];
}

export function buildRaindanceVideoBrief(params: {
  storyPremise: string;
  subjectRoles: string[];
  visualMotif?: string | undefined;
  mood?: string | undefined;
  ending?: string | undefined;
  photoRightsConfirmed: boolean;
  depictedPeopleConsentConfirmed: boolean;
  originalStoryConfirmed: boolean;
  audioPlan: "silent" | "licensed-audio-added-later";
  audioRightsConfirmed: boolean;
}) {
  const premise = clean(params.storyPremise);
  const roles = unique(params.subjectRoles);
  const blockers = [
    !params.photoRightsConfirmed
      ? "Confirm permission to use every reference photo before using it in another tool."
      : "",
    !params.depictedPeopleConsentConfirmed
      ? "Confirm that each depicted person has agreed to this portrayal."
      : "",
    !params.originalStoryConfirmed
      ? "Confirm that the scene, movement, and shot choices will be original rather than copied from a particular video or performance."
      : "",
    !premise ? "Describe the original story premise." : "",
    params.audioPlan === "licensed-audio-added-later" && !params.audioRightsConfirmed
      ? "Confirm rights for the separately added audio, or keep the video silent."
      : "",
  ].filter(Boolean);
  const prompt = [
    "Create an original, silent visual short inspired only by the broad reveal-to-reunion emotional arc of a social-video trend.",
    premise,
    roles.length ? `Subject roles: ${roles.join("; ")}.` : "",
    clean(params.visualMotif) ? `Use this original visual motif: ${clean(params.visualMotif)}.` : "",
    clean(params.mood) ? `Mood: ${clean(params.mood)}.` : "",
    clean(params.ending) ? `Ending: ${clean(params.ending)}.` : "",
    "Use fresh staging, choreography, camera coverage, and frames. Keep recognizable people respectful and consistent without promising exact likeness.",
    params.audioPlan === "silent"
      ? "Keep the generated visual silent; add no song, lyrics, or recording."
      : "Keep the generated visual silent; any later audio must be separately licensed and added outside this text planner.",
    "Do not copy a named creator's performance, signature choreography, a specific video, lyrics, or sound recording.",
  ].filter(Boolean).join(" ");

  return {
    ready: blockers.length === 0,
    blockers,
    visualPrompt: prompt,
    subjectRoles: roles,
    audioPlan: params.audioPlan,
    boundary:
      "Text planning only. This MCP does not inspect or upload photos, generate or submit video, call providers, access accounts, or spend credits.",
  };
}

const storyboardBeats = [
  ["Establish the world", "Introduce a fresh location and its visual mood."],
  ["Show the first subject", "Give the opening subject a clear, natural action."],
  ["Create anticipation", "Use an original environmental cue to suggest someone is near."],
  ["Reveal a silhouette", "Introduce the second subject without copying a reference frame."],
  ["Show a familiar detail", "Use one user-specified, permission-cleared visual motif."],
  ["Pause", "Hold a readable moment before recognition."],
  ["Recognize", "Show a small, natural reaction rather than a staged imitation."],
  ["Choose to approach", "Let the emotional decision become the main movement."],
  ["Close the distance", "Use one steady camera move and preserve spatial continuity."],
  ["Reunite", "Resolve the moment with a gentle, original action."],
  ["Hold the memory", "End on a new image that feels personal to this story."],
] as const;

export function planRaindanceStoryboard(params: {
  durationSeconds: number;
  aspectRatio: string;
  personalDetail?: string | undefined;
}) {
  const duration = params.durationSeconds;
  const slot = Math.floor((duration * 100) / storyboardBeats.length) / 100;
  let elapsed = 0;
  const shots = storyboardBeats.map(([beat, direction], index) => {
    const startSeconds = Number(elapsed.toFixed(2));
    const shotDuration = index === storyboardBeats.length - 1
      ? Number((duration - elapsed).toFixed(2))
      : slot;
    elapsed += shotDuration;
    const detail = index === 4 ? clean(params.personalDetail) : "";
    return {
      shot: index + 1,
      beat,
      startSeconds,
      durationSeconds: shotDuration,
      direction: detail ? `${direction} Motif: ${detail}.` : direction,
    };
  });
  return {
    ready: duration > 0 && shots.every((shot) => shot.durationSeconds > 0),
    durationSeconds: duration,
    aspectRatio: clean(params.aspectRatio),
    shots,
    continuityAnchors: [
      "Keep subject roles and visual identity consistent across all shots.",
      "Choose original camera positions and movement; do not trace existing frames.",
      "Keep the storyboard visual-only; the MCP does not supply or add audio.",
    ],
    liveSettingsNote:
      "This is a text storyboard, not a product job. Check the current product settings and terms before using another service.",
  };
}

const copyRisk = /exact (?:copy|re-creation|recreation)|copy (?:the|that) (?:original|viral)|same (?:frames|choreography)|recreate (?:the|that) (?:video|performance)|use the original recording|lyrics? from/i;

export function auditRaindancePrompt(params: {
  prompt: string;
  photoRightsConfirmed: boolean;
  depictedPeopleConsentConfirmed: boolean;
  originalStoryConfirmed: boolean;
  audioRightsConfirmed: boolean;
}) {
  const prompt = clean(params.prompt);
  const blockers = [
    !prompt ? "A prompt is required." : "",
    !params.photoRightsConfirmed
      ? "Permission for reference photos has not been confirmed."
      : "",
    !params.depictedPeopleConsentConfirmed
      ? "Consent from depicted people has not been confirmed."
      : "",
    !params.originalStoryConfirmed
      ? "Original staging and shot choices have not been confirmed."
      : "",
  ].filter(Boolean);
  const warnings = [
    copyRisk.test(prompt)
      ? "The wording may request a protected performance, choreography, frames, lyrics, or recording. Reframe it as an original scene."
      : "",
    /song|music|audio|recording|lyrics/i.test(prompt) && !params.audioRightsConfirmed
      ? "Audio is mentioned without confirmed rights; keep the visual silent or use separately licensed audio."
      : "",
    prompt.length > 2500 ? "The prompt is long; shorten it for easier review and editing." : "",
  ].filter(Boolean);
  return {
    ready: blockers.length === 0,
    blockers,
    warnings,
    checks: {
      hasStoryDirection: /story|reveal|reunion|memory|recognition/i.test(prompt),
      hasOriginalityDirection: /original|fresh|new/i.test(prompt),
      mentionsAudio: /song|music|audio|recording|lyrics/i.test(prompt),
    },
    nextStep: blockers.length
      ? "Resolve every blocker before using this concept."
      : warnings.length
        ? "Review warnings and use only separately licensed audio."
        : "This text passed structural checks; it is not proof of rights or product compatibility.",
  };
}

const resources = [
  { topic: "create", title: "Airaindance Home", path: "/", purpose: "Open the current product and its availability." },
  { topic: "create", title: "How to Make an AI Raindance Video", path: "/how-to-do-raindance-ai-trend", purpose: "Read the product's creation guide." },
  { topic: "examples", title: "AI Raindance Examples and Shot Guide", path: "/raindance-ai-examples", purpose: "Review the public shot guide and examples." },
  { topic: "trend", title: "AI Raindance Trend Guide", path: "/raindance-ai-trend", purpose: "Review trend context and editorial boundaries." },
  { topic: "pricing", title: "Pricing", path: "/pricing", purpose: "Check current availability and terms directly." },
  { topic: "policy", title: "Privacy Policy", path: "/privacy", purpose: "Review the current data-handling policy." },
  { topic: "policy", title: "Terms of Service", path: "/terms", purpose: "Review current product and rights terms." },
] as const;

export function getAiraindanceResources(appBaseUrl: string, topic: ResourceTopic) {
  return resources
    .filter((item) => topic === "all" || item.topic === topic)
    .map((item) => ({ ...item, url: `${appBaseUrl}${item.path}` }));
}
