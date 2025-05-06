import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo, editTodo, selectTodosByFilter, selectTodosGroupedByDate } from "./todoSlice";

const Todo = () => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();

  // Получаем задачи с учетом фильтра
  const todos = useSelector((state) => selectTodosByFilter(state, filter));
  
  // Получаем задачи с группировкой по дате
  const groupedTodos = useSelector(selectTodosGroupedByDate);

  // Определяем цвет дедлайна
  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'inherit';
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = (deadlineDate - now) / (1000 * 60 * 60);
    
    if (deadlineDate < now) return 'red';
    if (diffHours <= 24) return 'orange';
    return 'green';
  };

  const handleAddTodo = () => {
    if (text.trim()) {
      dispatch(addTodo(text, deadline));
      setText("");
      setDeadline("");
    }
  };

  return (
    <div className="todo-container">
      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task"
        />
        
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* Группированный список */}
      {Object.entries(groupedTodos).map(([date, todos]) => (
        <div key={date} className="date-group">
          <h3>{date}</h3>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                style={{ borderLeft: `4px solid ${getDeadlineColor(todo.deadline)}` }}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleComplete(todo.id))}
                  />
                  <span>{todo.text}</span>
                  
                  {todo.deadline && (
                    <span className="deadline">
                      Due: {new Date(todo.deadline).toLocaleString()}
                    </span>
                  )}
                  
                  {todo.completed && (
                    <span className="completed-at">
                      Done at: {new Date(todo.completedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                
                <button
                  className="delete-btn"
                  onClick={() => dispatch(deleteTodo(todo.id))}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Todo;