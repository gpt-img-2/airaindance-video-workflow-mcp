import assert from "node:assert/strict";
import test from "node:test";
import {
  auditRaindancePrompt,
  buildRaindanceVideoBrief,
  getAiraindanceResources,
  planRaindanceStoryboard,
} from "../src/toolkit.js";

test("brief blocks until permissions and originality are confirmed", () => {
  const result = buildRaindanceVideoBrief({
    storyPremise: "Two friends recognize each other after a long journey",
    subjectRoles: ["traveler", "friend"],
    photoRightsConfirmed: false,
    depictedPeopleConsentConfirmed: false,
    originalStoryConfirmed: false,
    audioPlan: "silent",
    audioRightsConfirmed: false,
  });
  assert.equal(result.ready, false);
  assert.equal(result.blockers.length, 3);
  assert.match(result.boundary, /does not inspect or upload photos/);
});

test("builds a visual-only brief after checks pass", () => {
  const result = buildRaindanceVideoBrief({
    storyPremise: "Two friends find each other at a quiet train platform",
    subjectRoles: ["arriving friend", "waiting friend"],
    visualMotif: "a paper star",
    photoRightsConfirmed: true,
    depictedPeopleConsentConfirmed: true,
    originalStoryConfirmed: true,
    audioPlan: "silent",
    audioRightsConfirmed: false,
  });
  assert.equal(result.ready, true);
  assert.match(result.visualPrompt, /fresh staging, choreography/);
  assert.match(result.visualPrompt, /Keep the generated visual silent/);
});

test("storyboard creates eleven timed beats with an exact total", () => {
  const result = planRaindanceStoryboard({
    durationSeconds: 28,
    aspectRatio: "4:3",
    personalDetail: "a paper star",
  });
  assert.equal(result.shots.length, 11);
  assert.equal(Number(result.shots.reduce((sum, shot) => sum + shot.durationSeconds, 0).toFixed(2)), 28);
  assert.match(result.shots[4]?.direction || "", /a paper star/);
});

test("prompt audit flags copying and unlicensed audio", () => {
  const result = auditRaindancePrompt({
    prompt: "Copy the original choreography and use the original recording",
    photoRightsConfirmed: true,
    depictedPeopleConsentConfirmed: true,
    originalStoryConfirmed: true,
    audioRightsConfirmed: false,
  });
  assert.equal(result.ready, true);
  assert.equal(result.warnings.length, 2);
});

test("resources use only the configured canonical origin", () => {
  const result = getAiraindanceResources("https://airaindance.video", "examples");
  assert.equal(result.length, 1);
  assert.equal(result[0]?.url, "https://airaindance.video/raindance-ai-examples");
});
