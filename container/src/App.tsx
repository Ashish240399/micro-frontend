import { lazy, Suspense } from "react";

// Lazy load the remote modules
const AuthApp = lazy(() => import("authentication/AuthApp"));
const TaskApp = lazy(() => import("task/TaskApp"));

const App = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "red",
      }}
    >
      <h1>Container Application</h1>
      <Suspense fallback={<>Loading ...</>}>
        <AuthApp />
      </Suspense>

      <hr />

      <Suspense fallback={<>Loading ...</>}>
        <TaskApp />
      </Suspense>
    </div>
  );
};

export default App;
