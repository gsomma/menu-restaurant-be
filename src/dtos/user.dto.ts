import { IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { EnumToArray } from "src/common/function.helper";
import { UserProfile } from "src/enums/user-profile.enum";

export class UserDto {
    @IsInt()
    @IsOptional()
    id: number;

    @IsNotEmpty({ message: "Nome obbligatoria" })
    fullName: string;

    @IsNotEmpty({ message: "Username obbligatoria" })
    username: string;

    password: string;

    @IsNotEmpty({ message: "Profilo obbligatorio", groups: ["create", "update"] })
    @IsIn(EnumToArray(UserProfile), { message: "Profilo non valido" })
    profile: UserProfile;

    isActive: boolean;
}