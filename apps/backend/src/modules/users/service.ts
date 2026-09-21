import UserRepository from "./repository";
import { type NewUser, type User, type UpdateUser } from "@repo/db";
import { AppError, NotFoundError } from "src/errors";
import { catchError } from "src/utils/catch-error";

export default class UserService {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async register(data: NewUser): Promise<User> {
        // Check if user already exists
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new AppError("User already exists", 409);
        }

        // Create user + profile in a transaction
        const [err, user] = await catchError(this.userRepository.createWithProfile(data));

        if (err || !user) {
            throw new AppError("Failed to register user", 500, { detail: (err as any)?.message });
        }

        return user;
    }

    public async getByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(`User not found with matching filter: email = ${email}`);
        }
        return user;
    }

    public async getById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError(`User not found with matching filter: id = ${id}`);
        }
        return user;
    }

    public async getAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async update(email: string, data: UpdateUser): Promise<User> {
        // Verify user exists first
        const existing = await this.userRepository.findByEmail(email);
        if (!existing) {
            throw new NotFoundError("User not found");
        }

        const [err, updated] = await catchError(this.userRepository.update(email, data));

        if (err || !updated) {
            throw new AppError("Failed to update user", 500);
        }

        return updated;
    }

    public async getProfile(userId: string) {
        const profile = await this.userRepository.findProfile(userId);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        return profile;
    }
}