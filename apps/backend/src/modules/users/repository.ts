import db, { eq, type NewUser, type Profile, type UpdateUser, type User, profileTable, usersTable } from "@repo/db";

export default class UserRepository {

    public async findAll(): Promise<User[]> {
        return db.selectDistinct().from(usersTable).where(eq(usersTable.isActive, true));
    }

    public async findByEmail(email: string): Promise<User | null> {
        const rows = await db.selectDistinct().from(usersTable).where(eq(usersTable.email, email));
        return rows[0] ?? null;
    }

    public async findById(id: string): Promise<User | null> {
        const rows = await db.selectDistinct().from(usersTable).where(eq(usersTable.id, id));
        return rows[0] ?? null;
    }

    public async create(data: NewUser): Promise<User | null> {
        const rows = await db.insert(usersTable).values({
            name: data.name,
            email: data.email,
            password: data.password,
        }).returning();
        return rows[0] ?? null;
    }

    public async createWithProfile(data: NewUser): Promise<User | null> {
        return db.transaction(async (tx) => {
            const users = await tx.insert(usersTable).values({
                name: data.name,
                email: data.email,
                password: data.password,
            }).returning();

            const user = users[0];
            if (!user) return null;

            await tx.insert(profileTable).values({ userId: user.id }).returning();

            return user;
        });
    }

    public async update(email: string, data: UpdateUser): Promise<User | null> {
        const rows = await db.update(usersTable)
            .set({ ...data })
            .where(eq(usersTable.email, email))
            .returning();
        return rows[0] ?? null;
    }

    public async findProfile(userId: string): Promise<Profile | null> {
        const rows = await db.selectDistinct().from(profileTable).where(eq(profileTable.userId, userId));
        return rows[0] ?? null;
    }
}