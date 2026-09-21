const { z } = require("zod");

const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(80, "Display name must be 80 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  notifications: z.boolean(),
});

function parseSettingsPayload(body) {
  const notificationsRaw = body?.notifications;
  const notifications =
    notificationsRaw === true ||
    notificationsRaw === "true" ||
    notificationsRaw === "on";

  return settingsSchema.safeParse({
    displayName: body?.displayName ?? "",
    email: body?.email ?? "",
    notifications,
  });
}

module.exports = { settingsSchema, parseSettingsPayload };
