import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../common/prisma/prisma.service";
import type { AuthPrincipal } from "../auth/auth.types";
import { CreateWatchlistDto } from "./dto/create-watchlist.dto";
import { UpdateWatchlistDto } from "./dto/update-watchlist.dto";
import { AddAssetDto } from "./dto/add-asset.dto";
import type { WatchlistDto } from "./dto/watchlist-response.dto";

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthPrincipal): Promise<WatchlistDto[]> {
    const watchlists = await this.prisma.watchlist.findMany({
      where: { userId: user.id },
      include: { assets: true },
      orderBy: { createdAt: "asc" },
    });
    return watchlists.map((watchlist) => this.toDto(watchlist));
  }

  async create(user: AuthPrincipal, dto: CreateWatchlistDto): Promise<WatchlistDto> {
    const created = await this.prisma.watchlist.create({
      data: {
        userId: user.id,
        name: dto.name,
        description: dto.description,
      },
      include: { assets: true },
    });
    return this.toDto(created);
  }

  async update(user: AuthPrincipal, id: string, dto: UpdateWatchlistDto): Promise<WatchlistDto> {
    await this.ensureOwnership(user.id, id);
    const updated = await this.prisma.watchlist.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
      },
      include: { assets: true },
    });
    return this.toDto(updated);
  }

  async remove(user: AuthPrincipal, id: string): Promise<void> {
    await this.ensureOwnership(user.id, id);
    await this.prisma.watchlist.delete({
      where: { id },
    });
  }

  async addAsset(user: AuthPrincipal, watchlistId: string, dto: AddAssetDto): Promise<WatchlistDto> {
    await this.ensureOwnership(user.id, watchlistId);
    await this.prisma.watchlistAsset.create({
      data: {
        watchlistId,
        symbol: dto.symbol.toUpperCase(),
        notes: dto.notes,
      },
    });
    const updated = await this.findWatchlist(user.id, watchlistId);
    return this.toDto(updated);
  }

  async removeAsset(user: AuthPrincipal, watchlistId: string, assetId: string): Promise<WatchlistDto> {
    await this.ensureOwnership(user.id, watchlistId);
    await this.prisma.watchlistAsset.delete({
      where: { id: assetId },
    });
    const updated = await this.findWatchlist(user.id, watchlistId);
    return this.toDto(updated);
  }

  private async ensureOwnership(userId: string, watchlistId: string): Promise<void> {
    const watchlist = await this.prisma.watchlist.findUnique({
      where: { id: watchlistId },
      select: { userId: true },
    });
    if (!watchlist) {
      throw new NotFoundException("Watchlist not found.");
    }
    if (watchlist.userId !== userId) {
      throw new ForbiddenException("You do not have access to this watchlist.");
    }
  }

  private async findWatchlist(userId: string, id: string) {
    const watchlist = await this.prisma.watchlist.findFirst({
      where: { id, userId },
      include: { assets: true },
    });
    if (!watchlist) {
      throw new NotFoundException("Watchlist not found.");
    }
    return watchlist;
  }

  private toDto(watchlist: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    assets: Array<{ id: string; symbol: string; notes: string | null; createdAt: Date }>;
  }): WatchlistDto {
    return {
      id: watchlist.id,
      name: watchlist.name,
      description: watchlist.description ?? undefined,
      createdAt: watchlist.createdAt.toISOString(),
      updatedAt: watchlist.updatedAt.toISOString(),
      assets: watchlist.assets.map((asset) => ({
        id: asset.id,
        symbol: asset.symbol,
        notes: asset.notes ?? undefined,
        createdAt: asset.createdAt.toISOString(),
      })),
    };
  }
}
