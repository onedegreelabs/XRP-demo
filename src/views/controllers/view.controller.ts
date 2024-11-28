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
  @Render('login') // signup.hbs 템플릿 렌더링
  showSignupForm() {}

  @Get('discover')
  @Render('discover') // discover.hbs 템플릿 렌더링
  showDiscoverPage() {}

  @Get('me')
  @Render('my-page') // my.hbs 템플릿 렌더링
  showMyPage() {}

  @Get('create')
  @Render('create-event') // create-event.hbs 템플릿 렌더링
  showCreateEventPage() {}
}
