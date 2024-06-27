import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VerifyEmailGuard extends AuthGuard('verify-email') {}