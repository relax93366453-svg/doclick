export function StatusBadge({ value }: { value: string }) {
  const tone =
    value.includes("正常") || value.includes("成交") || value.includes("已")
      ? "bg-emerald-50 text-emerald-700"
      : value.includes("低") || value.includes("待")
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-700";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{value}</span>;
}
