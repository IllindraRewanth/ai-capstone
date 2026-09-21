const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../server");
const { parseSettingsPayload } = require("../src/settingsSchema");
const { resetSettings, saveSettings } = require("../src/settingsStore");

describe("parseSettingsPayload", () => {
  it("accepts valid trimmed input", () => {
    const result = parseSettingsPayload({
      displayName: "  Alex  ",
      email: "alex@example.com",
      notifications: true,
    });
    assert.equal(result.success, true);
    assert.deepEqual(result.data, {
      displayName: "Alex",
      email: "alex@example.com",
      notifications: true,
    });
  });

  it("rejects empty display name after trim", () => {
    const result = parseSettingsPayload({
      displayName: "   ",
      email: "alex@example.com",
      notifications: false,
    });
    assert.equal(result.success, false);
  });

  it("rejects invalid email", () => {
    const result = parseSettingsPayload({
      displayName: "Alex",
      email: "@",
      notifications: false,
    });
    assert.equal(result.success, false);
  });

  it("rejects display names over 80 characters", () => {
    const result = parseSettingsPayload({
      displayName: "a".repeat(81),
      email: "alex@example.com",
      notifications: false,
    });
    assert.equal(result.success, false);
  });
});

describe("POST /api/settings", () => {
  beforeEach(() => {
    resetSettings();
  });

  it("persists valid settings", async () => {
    const response = await request(app)
      .post("/api/settings")
      .send({
        displayName: "Sam",
        email: "sam@example.com",
        notifications: true,
      })
      .expect(200);

    assert.equal(response.body.ok, true);
    assert.deepEqual(response.body.settings, {
      displayName: "Sam",
      email: "sam@example.com",
      notifications: true,
    });
  });

  it("returns field errors for invalid payload without overwriting saved data", async () => {
    saveSettings({
      displayName: "Prior",
      email: "prior@example.com",
      notifications: false,
    });

    const response = await request(app)
      .post("/api/settings")
      .send({ displayName: "", email: "not-an-email", notifications: false })
      .expect(400);

    assert.equal(response.body.error, "Validation failed");
    assert.ok(response.body.fieldErrors.email);

    const getResponse = await request(app).get("/api/settings").expect(200);
    assert.deepEqual(getResponse.body, {
      displayName: "Prior",
      email: "prior@example.com",
      notifications: false,
    });
  });
});
