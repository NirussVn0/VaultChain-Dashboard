import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";
import type { HealthSnapshot } from "./health.service";

@Controller({
  path: "health",
  version: "1",
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthSnapshot {
    return this.healthService.current();
  }
}
