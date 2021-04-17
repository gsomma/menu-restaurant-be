import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decode } from 'node:punycode';
import { JWT_CONSTANTS } from 'src/common/constants';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.profile };
    //const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<any> {
    const decoded: any = this.jwtService.verify(token, { secret: JWT_CONSTANTS.SECRET });
    return decoded;
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
  }
}