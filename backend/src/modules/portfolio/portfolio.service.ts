import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../common/prisma/prisma.service";
import type { AuthPrincipal } from "../auth/auth.types";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { CreatePositionDto } from "./dto/create-position.dto";
import { UpdatePositionDto } from "./dto/update-position.dto";
import type { PortfolioSummaryDto } from "./dto/portfolio-response.dto";

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async listPortfolios(user: AuthPrincipal): Promise<PortfolioSummaryDto[]> {
    const portfolios = await this.prisma.portfolio.findMany({
      where: { userId: user.id },
      include: {
        positions: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return portfolios.map((portfolio) => this.toSummary(portfolio));
  }

  async getPortfolio(user: AuthPrincipal, portfolioId: string): Promise<PortfolioSummaryDto> {
    const portfolio = await this.findOwnedPortfolio(user.id, portfolioId);
    return this.toSummary(portfolio);
  }

  async createPortfolio(user: AuthPrincipal, dto: CreatePortfolioDto): Promise<PortfolioSummaryDto> {
    const created = await this.prisma.portfolio.create({
      data: {
        userId: user.id,
        name: dto.name,
        baseCurrency: dto.baseCurrency?.toUpperCase() ?? "USD",
        description: dto.description,
      },
      include: { positions: true },
    });
    return this.toSummary(created);
  }

  async updatePortfolio(
    user: AuthPrincipal,
    portfolioId: string,
    dto: UpdatePortfolioDto,
  ): Promise<PortfolioSummaryDto> {
    await this.ensureOwnership(user.id, portfolioId);
    const updated = await this.prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        name: dto.name,
        baseCurrency: dto.baseCurrency?.toUpperCase(),
        description: dto.description,
      },
      include: { positions: true },
    });
    return this.toSummary(updated);
  }

  async deletePortfolio(user: AuthPrincipal, portfolioId: string): Promise<void> {
    await this.ensureOwnership(user.id, portfolioId);
    await this.prisma.portfolio.delete({
      where: { id: portfolioId },
    });
  }

  async addPosition(
    user: AuthPrincipal,
    portfolioId: string,
    dto: CreatePositionDto,
  ): Promise<PortfolioSummaryDto> {
    await this.ensureOwnership(user.id, portfolioId);
    await this.prisma.portfolioPosition.create({
      data: {
        portfolioId,
        symbol: dto.symbol.toUpperCase(),
        quantity: new Prisma.Decimal(dto.quantity),
        costBasis: new Prisma.Decimal(dto.costBasis),
        averageEntryPrice: new Prisma.Decimal(dto.averageEntryPrice),
        notes: dto.notes,
      },
    });

    const updated = await this.findOwnedPortfolio(user.id, portfolioId);
    return this.toSummary(updated);
  }

  async updatePosition(
    user: AuthPrincipal,
    portfolioId: string,
    positionId: string,
    dto: UpdatePositionDto,
  ): Promise<PortfolioSummaryDto> {
    await this.ensureOwnership(user.id, portfolioId);
    const position = await this.prisma.portfolioPosition.findFirst({
      where: { id: positionId, portfolioId },
    });
    if (!position) {
      throw new NotFoundException("Position not found.");
    }

    await this.prisma.portfolioPosition.update({
      where: { id: positionId },
      data: {
        symbol: dto.symbol?.toUpperCase(),
        quantity: dto.quantity !== undefined ? new Prisma.Decimal(dto.quantity) : undefined,
        costBasis: dto.costBasis !== undefined ? new Prisma.Decimal(dto.costBasis) : undefined,
        averageEntryPrice:
          dto.averageEntryPrice !== undefined ? new Prisma.Decimal(dto.averageEntryPrice) : undefined,
        notes: dto.notes,
      },
    });

    const updated = await this.findOwnedPortfolio(user.id, portfolioId);
    return this.toSummary(updated);
  }

  async removePosition(user: AuthPrincipal, portfolioId: string, positionId: string): Promise<PortfolioSummaryDto> {
    await this.ensureOwnership(user.id, portfolioId);
    await this.prisma.portfolioPosition.delete({
      where: { id: positionId },
    });
    const updated = await this.findOwnedPortfolio(user.id, portfolioId);
    return this.toSummary(updated);
  }

  private async ensureOwnership(userId: string, portfolioId: string): Promise<void> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      select: { userId: true },
    });
    if (!portfolio) {
      throw new NotFoundException("Portfolio not found.");
    }
    if (portfolio.userId !== userId) {
      throw new ForbiddenException("You do not have access to this portfolio.");
    }
  }

  private async findOwnedPortfolio(userId: string, portfolioId: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
      include: { positions: true },
    });
    if (!portfolio) {
      throw new NotFoundException("Portfolio not found.");
    }
    return portfolio;
  }

  private toSummary(portfolio: {
    id: string;
    name: string;
    baseCurrency: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    positions: Array<{
      id: string;
      symbol: string;
      quantity: Prisma.Decimal;
      costBasis: Prisma.Decimal;
      averageEntryPrice: Prisma.Decimal;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }): PortfolioSummaryDto {
    const totalCost = portfolio.positions.reduce((acc, item) => acc + item.costBasis.toNumber(), 0);
    const totalQty = portfolio.positions.reduce((acc, item) => acc + item.quantity.toNumber(), 0);

    return {
      id: portfolio.id,
      name: portfolio.name,
      baseCurrency: portfolio.baseCurrency,
      description: portfolio.description ?? undefined,
      createdAt: portfolio.createdAt.toISOString(),
      updatedAt: portfolio.updatedAt.toISOString(),
      totalCost,
      totalQuantity: totalQty,
      positions: portfolio.positions.map((position) => ({
        id: position.id,
        symbol: position.symbol,
        quantity: position.quantity.toNumber(),
        costBasis: position.costBasis.toNumber(),
        averageEntryPrice: position.averageEntryPrice.toNumber(),
        notes: position.notes ?? undefined,
        createdAt: position.createdAt.toISOString(),
        updatedAt: position.updatedAt.toISOString(),
      })),
    };
  }
}
