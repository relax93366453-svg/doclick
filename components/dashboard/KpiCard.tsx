export function KpiCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <h3 className="text-2xl font-bold">{value}</h3>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{trend}</span>
      </div>
    </div>
  );
}
