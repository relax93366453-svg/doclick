import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { customers, kpis, products } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppLayout title="主控台">
      <PageHeader
        title="營運總覽"
        description="即時查看銷售、庫存、表單審核、人事與財務狀態。"
      />

      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((item) => <KpiCard key={item.label} {...item} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SalesChart />
        <div className="card">
          <h3 className="mb-4 font-semibold">今日待辦</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-800">8 筆報銷申請待審核</div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-800">3 位客戶超過 7 天未跟進</div>
            <div className="rounded-xl bg-red-50 p-3 text-red-800">18 項商品低於安全庫存</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold">庫存警示</h3>
          <DataTable
            columns={["商品", "SKU", "庫存", "安全庫存", "狀態"]}
            rows={products.map((p) => ({ 商品: p.name, SKU: p.sku, 庫存: p.stock, 安全庫存: p.safeStock, 狀態: p.status }))}
          />
        </div>
        <div>
          <h3 className="mb-3 font-semibold">近期客戶</h3>
          <DataTable
            columns={["客戶", "負責人", "階段", "下次跟進"]}
            rows={customers.map((c) => ({ 客戶: c.name, 負責人: c.owner, 階段: c.stage, 下次跟進: c.nextFollowUp }))}
          />
        </div>
      </div>
    </AppLayout>
  );
}
