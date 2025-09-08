import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { organization } from "./auth";
import { relations } from "drizzle-orm";

export const scripts = pgTable("scripts", {
  id: text("id").primaryKey().default(createId()),
  name: text("name").notNull(),
  content: text("content").notNull(),
  systemPrompt: text("system_prompt").notNull(),
  configuration: jsonb("configuration").$type<{
    temperature?: number;
    maxTokens?: number;
    voice?: string;
    responseTime?: number;
  }>(),
  organizationId: text("organization_id")
    .references(() => organization.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const scriptsRelations = relations(scripts, ({ one }) => ({
  organization: one(organization, {
    fields: [scripts.organizationId],
    references: [organization.id],
  }),
}));
