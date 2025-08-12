import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  highTraffic: number;
  lowTraffic: number;
}

const COLORS = ["#FF8042", "#00C49F"];

export default function FuelBreakdownChart({ highTraffic, lowTraffic }: Props) {
  const data = [
    { name: "High Traffic", value: highTraffic },
    { name: "Low Traffic", value: lowTraffic },
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
