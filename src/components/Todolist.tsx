import { useEffect } from "react";
import { useState } from "react";
import _ from "lodash";

import "./todolist.css";
type Tasks = { task: { input: string }; completed: boolean };

export default function Todolist() {
  return (
    <div className="tdl">
      <h1 className="tdl--title">todos</h1>
      <List />
    </div>
  );
}

function List() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleChange = (e: { target: { value: string } }) => {
    const newInput = e.target.value;
    setInput(newInput);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && input !== "") {
      const newObject = { task: { input }, completed: false };
      setTasks([...tasks, newObject]);
      setInput("");
    }
  };
  const handleCheckbox = (index: number) => {
    setTasks((tasks) =>
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemove = (index: number) => {
    setTasks((tasks) => tasks.filter((task, i) => i !== index));
  };

  const CompletedTasks = tasks.filter((task) => task.completed);
  const ActiveTasks = tasks.filter((task) => !task.completed);

  return (
    <>
      <input
        type="text"
        className="tdl--header"
        placeholder="What needs to be done?"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {_.size(tasks) !== 0 && (
        <div className="tdl--body">
          {filteredTasks.map((obj, index) => (
            <div key={index} className="tdl--task">
              <input
                type="checkbox"
                className="tdl--checkbox"
                checked={obj.completed}
                onChange={() => handleCheckbox(index)}
              />
              {obj.task.input}

              <span className="tdl--x" onClick={() => handleRemove(index)}>
                x
              </span>
              <br />
            </div>
          ))}
          <div className="tdl--filters">
            {_.size(tasks) !== 0 && (
              <span className="tdl--text">
                {_.size(ActiveTasks)} tasks left!
              </span>
            )}
            <button
              className="tdl--btn-all"
              onClick={() => {
                setFilteredTasks(tasks);
              }}
            >
              All
            </button>
            <button
              className="tdl--btn-active"
              onClick={() => {
                setFilteredTasks(ActiveTasks);
              }}
            >
              Active
            </button>
            <button
              className="tdl--btn-completed"
              onClick={() => {
                setFilteredTasks(CompletedTasks);
              }}
            >
              Completed
            </button>
            <button
              className="tdl--btn-clear"
              onClick={() => {
                setTasks(ActiveTasks);
              }}
            >
              Clear Completed
            </button>
          </div>
        </div>
      )}
    </>
  );
}
