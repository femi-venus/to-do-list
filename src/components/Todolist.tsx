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
      state.input = ""; // Clear input after adding task
      break;
    case "change_status":
      state.tasks[action.payload].completed =
        !state.tasks[action.payload].completed;
      break;
    case "delete_task":
      state.tasks.filter((task, index) => index !== action.payload);
      break;
    case "set_filtered_tasks":
      state.filteredTasks = action.payload;
      break;
    case "clear_completed":
      state.tasks = state.tasks.filter((task) => !task.completed);
      break;
    default:
      break;
  }
});

function List() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "set_filtered_tasks", payload: state.tasks });
  }, [state.tasks]);

  const filterTasks = (filter: string) => {
    let filteredTasks;
    switch (filter) {
      case "all":
        filteredTasks = state.tasks;
        break;
      case "active":
        filteredTasks = state.tasks.filter((task) => !task.completed);
        break;
      case "completed":
        filteredTasks = state.tasks.filter((task) => task.completed);
        break;
      default:
        filteredTasks = state.tasks;
    }
    dispatch({ type: "set_filtered_tasks", payload: filteredTasks });
  };

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
            <button className="tdl--btn-all" onClick={() => filterTasks("all")}>
              All
            </button>
            <button
              className="tdl--btn-active"
              onClick={() => filterTasks("active")}
            >
              Active
            </button>
            <button
              className="tdl--btn-completed"
              onClick={() => filterTasks("completed")}
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
