import { useState } from "react";
import { trpc } from "../lib/trpc";

export function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const utils = trpc.useUtils();
  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      setTitle("");
      setDescription("");
      setPriority("medium");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate({ title, description, priority });
  };

  return (
    <form onSubmit = {handleSubmit} className="space-y-4">
      <div>
        <input
          type = "text"
          placeholder = "Task title"
          value = {title}
          onChange = {(e) => setTitle(e.target.value)}
          className = "w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div>
        <textarea
          placeholder = "Description (optional)"
          value = {description}
          onChange = {(e) => setDescription(e.target.value)}
          className = "w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
          rows = {2}
        />
      </div>
      <div className = "flex gap-4">
        <select
          value = {priority}
          onChange = {(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          className = "p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500"
        >
          <option value = "low">Low-Priority</option>
          <option value = "medium">Medium-Priority</option>
          <option value = "high">High-Priority</option>
        </select>
        <button
          type = "submit"
          disabled = {createTask.isPending}
          className = "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium disabled:opacity-50"
        >
          {createTask.isPending ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
