import { IsNotEmpty, MinLength } from 'class-validator';

export class PasswordDto {

    @IsNotEmpty({ message: "Password precedente obbligatoria" })
    oldPassword: string;

    @IsNotEmpty({ message: "Nuova password obbligatoria" })
    @MinLength(5, { message: "Nuova password minimo 5 caratteri" })
    newPassword: string;

}