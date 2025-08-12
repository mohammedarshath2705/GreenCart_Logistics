// src/components/KPISection.tsx
export interface KPIProps {
  totalProfit: number;
  efficiencyScore: number;
  onTimeCount: number;
  lateCount: number;
  totalDeliveries?: number;
  assignedCount?: number;
}

export default function KPISection(props: KPIProps) {
  const formatCurrency = (v: number) =>
    `₹${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Total Profit</p>
        <div className="text-2xl font-bold mt-2">{formatCurrency(props.totalProfit)}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Efficiency</p>
        <div className="text-2xl font-bold mt-2">{props.efficiencyScore.toFixed(2)}%</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">On-time</p>
        <div className="text-2xl font-bold mt-2">{props.onTimeCount}</div>
        <p className="text-xs text-gray-400">{props.totalDeliveries ?? ""} total</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Late</p>
        <div className="text-2xl font-bold mt-2">{props.lateCount}</div>
        <p className="text-xs text-gray-400">Assigned: {props.assignedCount ?? "-"}</p>
      </div>
    </div>
  );
}
