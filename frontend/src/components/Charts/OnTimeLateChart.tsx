import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  onTime: number;
  late: number;
}

const COLORS = ["#00C49F", "#FF8042"];

export default function OnTimeLateChart({ onTime, late }: Props) {
  const data = [
    { name: "On Time", value: onTime },
    { name: "Late", value: late },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={100} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
