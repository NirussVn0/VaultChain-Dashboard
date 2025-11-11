import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { AuthUser } from "../../common/decorators/auth-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthPrincipal } from "../auth/auth.types";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { CreatePositionDto } from "./dto/create-position.dto";
import { UpdatePositionDto } from "./dto/update-position.dto";
import { PortfolioService } from "./portfolio.service";

@UseGuards(JwtAuthGuard)
@Controller({
  path: "portfolios",
  version: "1",
})
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  getPortfolios(@AuthUser() user: AuthPrincipal) {
    return this.portfolioService.listPortfolios(user);
  }

  @Post()
  createPortfolio(@AuthUser() user: AuthPrincipal, @Body() payload: CreatePortfolioDto) {
    return this.portfolioService.createPortfolio(user, payload);
  }

  @Get(":id")
  getPortfolio(@AuthUser() user: AuthPrincipal, @Param("id") portfolioId: string) {
    return this.portfolioService.getPortfolio(user, portfolioId);
  }

  @Patch(":id")
  updatePortfolio(
    @AuthUser() user: AuthPrincipal,
    @Param("id") portfolioId: string,
    @Body() payload: UpdatePortfolioDto,
  ) {
    return this.portfolioService.updatePortfolio(user, portfolioId, payload);
  }

  @Delete(":id")
  deletePortfolio(@AuthUser() user: AuthPrincipal, @Param("id") portfolioId: string) {
    return this.portfolioService.deletePortfolio(user, portfolioId);
  }

  @Post(":id/positions")
  addPosition(
    @AuthUser() user: AuthPrincipal,
    @Param("id") portfolioId: string,
    @Body() payload: CreatePositionDto,
  ) {
    return this.portfolioService.addPosition(user, portfolioId, payload);
  }

  @Patch(":id/positions/:positionId")
  updatePosition(
    @AuthUser() user: AuthPrincipal,
    @Param("id") portfolioId: string,
    @Param("positionId") positionId: string,
    @Body() payload: UpdatePositionDto,
  ) {
    return this.portfolioService.updatePosition(user, portfolioId, positionId, payload);
  }

  @Delete(":id/positions/:positionId")
  removePosition(
    @AuthUser() user: AuthPrincipal,
    @Param("id") portfolioId: string,
    @Param("positionId") positionId: string,
  ) {
    return this.portfolioService.removePosition(user, portfolioId, positionId);
  }
}
