import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { AuthUser } from "../../common/decorators/auth-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthPrincipal } from "../auth/auth.types";
import { CreateWatchlistDto } from "./dto/create-watchlist.dto";
import { UpdateWatchlistDto } from "./dto/update-watchlist.dto";
import { AddAssetDto } from "./dto/add-asset.dto";
import { WatchlistService } from "./watchlist.service";

@UseGuards(JwtAuthGuard)
@Controller({
  path: "watchlists",
  version: "1",
})
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  list(@AuthUser() user: AuthPrincipal) {
    return this.watchlistService.list(user);
  }

  @Post()
  create(@AuthUser() user: AuthPrincipal, @Body() payload: CreateWatchlistDto) {
    return this.watchlistService.create(user, payload);
  }

  @Patch(":id")
  update(@AuthUser() user: AuthPrincipal, @Param("id") id: string, @Body() payload: UpdateWatchlistDto) {
    return this.watchlistService.update(user, id, payload);
  }

  @Delete(":id")
  remove(@AuthUser() user: AuthPrincipal, @Param("id") id: string) {
    return this.watchlistService.remove(user, id);
  }

  @Post(":id/assets")
  addAsset(@AuthUser() user: AuthPrincipal, @Param("id") id: string, @Body() payload: AddAssetDto) {
    return this.watchlistService.addAsset(user, id, payload);
  }

  @Delete(":id/assets/:assetId")
  removeAsset(@AuthUser() user: AuthPrincipal, @Param("id") id: string, @Param("assetId") assetId: string) {
    return this.watchlistService.removeAsset(user, id, assetId);
  }
}
