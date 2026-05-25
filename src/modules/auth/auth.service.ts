import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { verifyPassword } from '../../common/utils/crypto';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.userService.create(dto);
    const token = await this.generateToken(user._id.toString(), user.email);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await verifyPassword(user.password, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.generateToken(user._id.toString(), user.email);
    return { user, token };
  }

  private async generateToken(sub: string, email: string): Promise<string> {
    return await this.jwtService.signAsync({ sub, email });
  }
}
