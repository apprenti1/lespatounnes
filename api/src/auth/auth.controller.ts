import { Controller, Post, Get, Body, Query, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Req() req: any) {
    return this.authService.getUserById(req.user.id);
  }

  @Get('usernames')
  async getAvailableUsernames(@Query('search') search?: string) {
    const usernames = await this.authService.getAvailableUsernames(search);
    return {
      success: true,
      data: usernames,
    };
  }

  @Patch('update-profile')
  @UseGuards(JwtGuard)
  async updateProfile(@Req() req: any, @Body() data: any) {
    return this.authService.updateProfile(req.user.id, data);
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  async changePassword(@Req() req: any, @Body() data: any) {
    return this.authService.changePassword(req.user.id, data);
  }
}
