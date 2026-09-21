import { boolean, date, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar({length: 255}).unique().notNull(),
    password: varchar({length: 255}),
    name: varchar({length: 36}).notNull(),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({
        withTimezone: true,
        mode: "date"
    }).notNull().defaultNow(),
    updatedAt: timestamp({
        withTimezone: true,
        mode: "date"
    }).notNull().defaultNow(),
})

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type UpdateUser = Partial<NewUser>

export const profileTable = pgTable("profile", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(()=> usersTable.id, {onDelete: "cascade"}).notNull(),
    bio: text(),
    gender: genderEnum(),
    dob: date(),
    phone: integer(),
    country: varchar({length: 255}),
})

export type Profile = typeof profileTable.$inferSelect;
export type NewProfile = typeof profileTable.$inferInsert;
export type UpdateProfile = Partial<NewProfile>