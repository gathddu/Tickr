import { trpc } from "../lib/trpc";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function Dashboard() {
  const tasks = trpc.tasks.list.useQuery();

  if (tasks.isLoading) {
    return <div className="text-zinc-400">Loading stats...</div>;
  }

  const allTasks = tasks.data || [];

  // status distribution
  const statusData = [
    { name: "Pending", value: allTasks.filter((t) => t.status === "pending").length, color: "#52525b" },
    { name: "In Progress", value: allTasks.filter((t) => t.status === "in_progress").length, color: "#3b82f6" },
    { name: "Completed", value: allTasks.filter((t) => t.status === "completed").length, color: "#22c55e" },
  ];

  // priority distribution
  const priorityData = [
    { name: "Low", value: allTasks.filter((t) => t.priority === "low").length },
    { name: "Medium", value: allTasks.filter((t) => t.priority === "medium").length },
    { name: "High", value: allTasks.filter((t) => t.priority === "high").length },
  ];

  const maxPriority = Math.max(...priorityData.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold">{allTasks.length}</div>
          <div className="text-sm text-zinc-400">Total Tasks</div>
        </div>
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold text-blue-400">
            {allTasks.filter((t) => t.status === "in_progress").length}
          </div>
          <div className="text-sm text-zinc-400">In Progress</div>
        </div>
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-2xl font-bold text-green-400">
            {allTasks.filter((t) => t.status === "completed").length}
          </div>
          <div className="text-sm text-zinc-400">Completed</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#09090b", 
                  border: "1px solid #52525b",
                  color: "#fafafa"
                }}
                itemStyle={{ color: "#fafafa" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" stroke="#71717a" />
              <YAxis stroke="#71717a" allowDecimals={false} domain={[0, maxPriority]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#09090b", 
                  border: "1px solid #52525b",
                  color: "#fafafa"
                }}
                itemStyle={{ color: "#fafafa" }}
                cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
              />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
