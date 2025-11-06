import { Injectable } from "@nestjs/common";
import { hostname } from "node:os";

export interface HealthSnapshot {
  status: "ok";
  timestamp: string;
  hostname: string;
  version: string;
}

@Injectable()
export class HealthService {
  current(): HealthSnapshot {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      hostname: hostname(),
      version: process.env["npm_package_version"] ?? "0.0.0",
    };
  }
}
