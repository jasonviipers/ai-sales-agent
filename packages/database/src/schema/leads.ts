import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { organization } from "./auth";
import { relations } from "drizzle-orm";

export const leads = pgTable("leads", {
  id: text("id").primaryKey().default(createId()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  company: text("company"),
  customFields: jsonb("custom_fields").$type<Record<string, any>>(),
  organizationId: text("organization_id")
    .references(() => organization.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    })
    .notNull(),
  status: text("status")
    .$type<
      "new" | "contacted" | "interested" | "qualified" | "converted" | "lost"
    >()
    .default("new")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const leadsRelations = relations(leads, ({ one }) => ({
  organization: one(organization, {
    fields: [leads.organizationId],
    references: [organization.id],
  }),
}));
