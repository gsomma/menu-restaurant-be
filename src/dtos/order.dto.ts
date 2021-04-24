import { IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { EnumToArray } from "src/common/function.helper";
import { OrderStatus } from "src/enums/order-status.enum";
import { OrderType } from "src/enums/order-type.enum";

export class OrderDto {
    @IsInt({ message: 'Id deve essere numerico' })
    @IsOptional()
    id: number;

    @IsNotEmpty({ message: "Tipo ordine obbligatorio", groups: ["create", "update"] })
    //@ApiProperty({description: 'Tipo ordine', required: true})
    @IsIn(EnumToArray(OrderType), { message: "Tipo ordine non valido" })
    type: OrderType;

    //@IsNotEmpty({ message: "Id numero obbligatorio" })
    //@IsNumber({maxDecimalPlaces: 0}, { message: "Id numero può essere solo numerico" })
    number: string;

    @IsNotEmpty({ message: "Data obbligatoria" })
    @IsDateString()
    date: Date;

    @IsNotEmpty({ message: "Stato ordine obbligatorio" })
    //@ApiProperty({description: 'Tipo ordine', required: true})
    @IsIn(EnumToArray(OrderStatus), { message: "stato ordine non valido" })
    status: OrderStatus;

    tableCode: string;
    
    @IsNotEmpty({ message: "Totale obbligatorio" })
    totalPrice: number;

    expectedDeliveryDate: Date;
}