import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { GlobalModule } from './global/global.module';

@Module({ imports: [HealthModule, GlobalModule] })
export class AppModule {}
