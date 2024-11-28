import { Module } from '@nestjs/common';
import { ViewController } from '@views/controllers/view.controller';

@Module({
  controllers: [ViewController],
})
export class ViewModule {}
