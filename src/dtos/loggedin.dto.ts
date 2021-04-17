import { MaxLength, IsNotEmpty, IsInt } from "class-validator";
import { Exclude } from "class-transformer";

export class LoggedinDto {

    @IsInt()
    id: number;

    @MaxLength(50, { message: "Username lunghezza massima 50 caratteri" })
    @IsNotEmpty({ message: "Username obbligatoria" })
    username: string;

    @Exclude()
    @MaxLength(50, { message: "Password lunghezza massima 50 caratteri" })
    @IsNotEmpty({ message: "Password obbligatoria" })
    password: string;

    @IsNotEmpty({ message: "Profilo obbligatorio" })
    profile: string;

    @IsNotEmpty({ message: "Token obbligatorio" })
    token: string;

    // public static from(dto: Partial<LoginDto>) {
    //     const result = new LoginDto();
    //     result.id = dto.id ? dto.id : 0;
    //     result.password = dto.password;
    //     result.profilo = dto.profilo;
    //     result.username = dto.username;
    //     return result;
    // }



    // async validate(group?: string) {

    //     let ret = { isValid: true, err: null };
    //     let sep = '';
    //     let message = '';

    //     const errors = await validate(this);
    //     //logger.debug(errors);

    //     if (errors.length > 0) {
    //         ret.isValid = false;
    //         errors.forEach((value) => {
    //             //logger.error('Validazione fallita, '+value.property+': '+JSON.stringify(value.constraints));
    //             message = message + sep + value.property + ': ' + JSON.stringify(value.constraints);
    //             sep = ' / ';
    //         });
    //         ret.err = new BadRequestException('Validazione fallita: ' + message);
    //     }
    //     //logger.debug('ret ' +JSON.stringify(ret));
    //     return ret;
    // }

}