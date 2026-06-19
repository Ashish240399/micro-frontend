declare module "authentication/AuthApp" {
  import { ComponentType } from "react";
  interface AuthAppProps {
    onLogin?: (user: { username: string; token: string }) => void;
  }
  const AuthApp: ComponentType<AuthAppProps>;
  export default AuthApp;
}

declare module "task/TaskApp" {
  import { ComponentType } from "react";
  const TaskApp: ComponentType<any>;
  export default TaskApp;
}
