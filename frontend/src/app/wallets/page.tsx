import { AssetTable } from "@/components/wallets/asset-table";
import { MultiSigApprovals } from "@/components/wallets/multisig-approvals";
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";

export default function WalletsPage() {
  return (
    <section className="flex min-h-dvh flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Institutional Wallets
          </h1>
          <p className="text-text-tertiary">
            Manage custody, multi-sig approvals, and asset allocation.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Deposit
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Transfer
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AssetTable />
        </div>
        <div className="lg:col-span-1">
          <MultiSigApprovals />
        </div>
      </div>
    </section>
  );
}
