import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"
import { organization, user } from "./auth";
import { relations } from "drizzle-orm";
import { leads } from "./leads";
import { scripts } from "./scripts";

export const calls = pgTable('calls', {
    id: text('id').primaryKey().default(createId()),
    twilioSid: text('twilio_sid').unique(),
    duration: integer("duration"), // in seconds
    transcript: text("transcript"),
    summary: text("summary"),
    sentiment: text("sentiment", { enum: ["positive", "neutral", "negative"] }),
    outcome: text("outcome", { enum: ["interested", "not_interested", "callback", "voicemail"] }),
    analysis: jsonb('analysis').$type<{
        keyPoints?: string[];
        objections?: string[];
        nextSteps?: string[];
        leadScore?: number;
    }>(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    endedAt: timestamp("ended_at"),
    scriptId: text('script_id').references(() => scripts.id, { onDelete: 'restrict', onUpdate: 'cascade' }).notNull(),
    startedBy: text("started_by").references(() => user.id).notNull(),
    leadId: text('lead_id').references(() => leads.id).notNull(),
    organizationId: text('organization_id') .references(() => organization.id, { onDelete: 'restrict', onUpdate: 'cascade' }).notNull(),
    status: text('status').$type<'connecting' | 'connected' | 'in_progress' | 'completed' | 'failed' | 'cancelled'>().default('connecting').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const callsRelations = relations(calls, ({ one }) => ({
    lead: one(leads, {
        fields: [calls.leadId],
        references: [leads.id],
    }),
    script: one(scripts, {
        fields: [calls.scriptId],
        references: [scripts.id],
    }),
    user: one(user, {
        fields: [calls.startedBy],
        references: [user.id],
    }),
    organization: one(organization, {
        fields: [calls.organizationId],
        references: [organization.id],
    }),
}));