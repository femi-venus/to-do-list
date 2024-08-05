import React, { useEffect, useReducer } from "react";
import produce from "immer";
import _ from "lodash";
import "./todolist.css";
import { Action, State } from "./types";

const initialState: State = {
  input: "",
  tasks: [],
  filteredTasks: [],
};

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case "set_input":
      state.input = action.payload;

      break;
    case "add_task":
      state.tasks.push(action.payload);
      state.filteredTasks.push(action.payload);

      state.input = ""; // Clear input after adding task
      break;
    case "change_status":
      const changed_status = state.tasks.map((task, i) =>
        i === action.payload ? { ...task, completed: !task.completed } : task
      );
      state.tasks = changed_status;
      state.filteredTasks = changed_status;

      break;
    case "delete_task":
      const undeleted_tasks = state.tasks.filter(
        (task, index) => index !== action.payload
      );
      state.tasks = undeleted_tasks;
      state.filteredTasks = undeleted_tasks;

      break;
    case "set_filtered_tasks":
      switch (action.payload) {
        case "all":
          state.filteredTasks = state.tasks;
          break;
        case "active":
          state.filteredTasks = state.tasks.filter((task) => !task.completed);
          break;
        case "completed":
          state.filteredTasks = state.tasks.filter((task) => task.completed);
          break;
        default:
          state.filteredTasks = state.tasks;
      }

      break;
    case "clear_completed":
      const cleared_tasks = state.tasks.filter((task) => !task.completed);
      state.tasks = cleared_tasks;
      state.filteredTasks = cleared_tasks;

      break;
    default:
      break;
  }
});

function List() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set_input", payload: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && state.input !== "") {
      const newTask = { task: state.input, completed: false };
      dispatch({ type: "add_task", payload: newTask });
    }
  };

  const handleCheckbox = (index: number) => {
    dispatch({ type: "change_status", payload: index });
  };

  const handleRemove = (index: number) => {
    dispatch({ type: "delete_task", payload: index });
  };

  return (
    <>
      <input
        type="text"
        className="tdl--header"
        placeholder="What needs to be done?"
        value={state.input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {state.tasks.length > 0 && (
        <div className="tdl--body">
          {state.filteredTasks.map((task, index) => (
            <div key={index} className="tdl--task">
              <input
                type="checkbox"
                className="tdl--checkbox"
                checked={task.completed}
                onChange={() => handleCheckbox(index)}
              />
              {task.task}
              <span className="tdl--x" onClick={() => handleRemove(index)}>
                x
              </span>
              <br />
            </div>
          ))}
          <div className="tdl--filters">
            <span className="tdl--text">
              {state.tasks.filter((task) => !task.completed).length} tasks left!
            </span>
            <button
              className="tdl--btn-all"
              onClick={() =>
                dispatch({ type: "set_filtered_tasks", payload: "all" })
              }
            >
              All
            </button>
            <button
              className="tdl--btn-active"
              onClick={() =>
                dispatch({ type: "set_filtered_tasks", payload: "active" })
              }
            >
              Active
            </button>
            <button
              className="tdl--btn-completed"
              onClick={() =>
                dispatch({ type: "set_filtered_tasks", payload: "completed" })
              }
            >
              Completed
            </button>
            <button
              className="tdl--btn-clear"
              onClick={() =>
                dispatch({
                  type: "clear_completed",
                })
              }
            >
              Clear Completed
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Todolist() {
  return (
    <div className="tdl">
      <h1 className="tdl--title">todos</h1>
      <List />
    </div>
  );
}
