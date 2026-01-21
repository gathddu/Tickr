import { trpc } from "../lib/trpc";

export function TaskList() {
  const tasks = trpc.tasks.list.useQuery();
  const utils = trpc.useUtils();

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => utils.tasks.list.invalidate(),
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: () => utils.tasks.list.invalidate(),
  });

  if (tasks.isLoading) {
    return <div className="text-zinc-400">Loading tasks...</div>;
  }

  if (tasks.data?.length === 0) {
    return <div className="text-zinc-500">No tasks yet. Create one?</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.data?.map((task) => (
        <div
          key={task.id}
          className="p-4 bg-zinc-900 rounded-lg border border-zinc-800"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{task.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded ${
                task.status === "completed"
                  ? "bg-green-900 text-green-300"
                  : task.status === "in_progress"
                  ? "bg-blue-900 text-blue-300"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-zinc-400 mt-2">{task.description}</p>
          )}
          <div className="flex gap-4 mt-3 text-xs text-zinc-500">
            <span>Priority: {task.priority}</span>
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            {task.status !== "completed" && (
              <button
                onClick={() =>
                  updateTask.mutate({
                    id: task.id,
                    status: task.status === "pending" ? "in_progress" : "completed",
                  })
                }
                className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded"
              >
                {task.status === "pending" ? "Start" : "Complete"}
              </button>
            )}
            <button
              onClick={() => deleteTask.mutate({ id: task.id })}
              className="text-xs px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
