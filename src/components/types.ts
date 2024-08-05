export interface Task {
  task: string;
  completed: boolean;
}

export interface State {
  input: string;
  tasks: Task[];
  filteredTasks: Task[];
}

export type Action =
  | SET_INPUT
  | ADD_TASK
  | CHANGE_STATUS
  | DELETE_TASK
  | SET_FILTETERED_TASKS
  | CLEAR_COMPLETED;

export type SET_INPUT = { type: "set_input"; payload: string };
export type ADD_TASK = { type: "add_task"; payload: Task };
export type CHANGE_STATUS = { type: "change_status"; payload: number };
export type DELETE_TASK = { type: "delete_task"; payload: number };
export type SET_FILTETERED_TASKS = {
  type: "set_filtered_tasks";

  payload: string;
};
export type CLEAR_COMPLETED = { type: "clear_completed" };
