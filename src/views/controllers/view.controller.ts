import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ViewController {
  constructor() {}

  @Get('/')
  redirectToDiscover(@Res() res: Response) {
    return res.render('discover');
  }

  @Get('login')
  @Render('login')
  showSignupForm() {}

  @Get('discover')
  @Render('discover')
  showDiscoverPage() {}

  @Get('me')
  @Render('my-page')
  showMyPage() {}

  @Get('create')
  @Render('create-event')
  showCreateEventPage() {}
}
