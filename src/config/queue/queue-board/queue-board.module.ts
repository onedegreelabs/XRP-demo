// queue-board.module.ts

import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from '@config/queue/queue-board/queue-board.module-definition';
import { BullModule } from '@nestjs/bullmq';

@Module({})
export class QueueBoardModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const bullModules = options.queues.map((name) =>
      BullModule.registerQueue({ name }),
    );

    const flowProducers = (options.flows || []).map((flow) =>
      BullModule.registerFlowProducer({
        name: flow,
      }),
    );

    return {
      ...super.register(options),
      imports: [...bullModules, ...flowProducers],
      exports: [...bullModules, ...flowProducers],
    };
  }
}
