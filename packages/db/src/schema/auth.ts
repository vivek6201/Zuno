import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { createSelectSchema } from "drizzle-orm/zod";

export const sessionsTable = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"}),    
    token: varchar({length: 255}).notNull(),
    ipAddress: varchar({length: 255}),
    userAgent: varchar({length: 255}),
    deviceType: varchar({length: 255}),
    location: varchar({length: 255}),
    fingerprint: varchar({length: 255}),
    isRevoked: boolean().default(false).notNull(),
    
    createdAt: timestamp({
        withTimezone: true,
        mode: "date"
    }).notNull().defaultNow(),
    expiresAt: timestamp({
        withTimezone: true,
        mode: "date"
    }).notNull()
})

export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;
export type UpdateSession = Partial<NewSession>
export const sessionSchema = createSelectSchema(sessionsTable);