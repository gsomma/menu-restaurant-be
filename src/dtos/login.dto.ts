import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsString({ message: 'Username deve essere una stringa'})
    @IsNotEmpty({ message: "Username obbligatoria" })
    username: string;

    @IsString({ message: 'Password deve essere una stringa'})
    @IsNotEmpty({ message: "Password obbligatoria" })
    password: string;

}