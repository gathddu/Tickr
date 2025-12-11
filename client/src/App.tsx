import { trpc } from "./lib/trpc";
import { TaskList } from "./components/TaskList";
import { CreateTask } from "./components/CreateTask";

function App() {
    const health = trpc.health.useQuery();

    return (
        <div className = "min-h-screen p-8">
            <div className = "max-w-2xl mx-auto">
                <div className = "mb-8">
                    <h1 className = "text-4xl font-bold mb-2">Tickr</h1>
                    <p className = "text-zinc-400">Task management meets time tracking.</p>
                    {health.data && (
                        <span className = "text-xs text-green-500">● Connected</span>
                    )}
                </div>

                <div className = "mb-8">
                    <h2 className = "text-xl font-semibold mb-4">New Task</h2>
                    <CreateTask />
                </div>

                <div>
                    <h2 className = "text-xl font-semibold mb-4">Tasks</h2>
                    <TaskList />
                </div>
            </div>
        </div>
    );
}

export default App;
