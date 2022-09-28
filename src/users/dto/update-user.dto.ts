import { User } from "../user.entity";

export type UpdateUserDto = Partial<Omit<User, '_id'>>
