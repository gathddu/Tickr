import { trpc } from "./lib/trpc";

function App() {
    const health = trpc.health.useQuery();

  return (
    <div className = "min-h-screen flex items-center justify-center">
      <div className = "text-center">
        <h1 className = "text-5x1 font-bold mb-4">Tickr</h1>
        <p className = "text-zinc-400">Task management meets time tracking.</p>
        
        <div className = "text-sm text-zinc-500">
          {health.isLoading && <span>Connecting to server...</span>}
          {health.data && <span>Server status: {health.data.status}</span>}
          {health.error && <span className = "text-red-400">Server offline</span>}
        </div>
      </div>
    </div>
  );
}

export default App;
