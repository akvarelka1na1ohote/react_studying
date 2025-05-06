import { createSlice, nanoid } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (text, deadline) => ({
        payload: {
          id: nanoid(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
          deadline: deadline, // Добавляем дедлайн
          completedAt: null
        },
      }),
    },
    toggleComplete: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.completedAt = todo.completed ? new Date().toISOString() : null;
      }
    },
    deleteTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action) => {
      const { id, newText, newDeadline } = action.payload;
      const todo = state.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
        if (newDeadline) todo.deadline = newDeadline;
      }
    },
  },
});

// Добавляем селекторы для фильтрации
export const selectTodosByFilter = (state, filter) => {
  switch (filter) {
    case 'completed':
      return state.todos.filter(todo => todo.completed);
    case 'active':
      return state.todos.filter(todo => !todo.completed);
    default:
      return state.todos;
  }
};

// Селектор для группировки по датам
export const selectTodosGroupedByDate = (state) => {
  const grouped = {};
  state.todos.forEach(todo => {
    const date = new Date(todo.completed ? todo.completedAt : todo.createdAt).toDateString();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(todo);
  });
  return grouped;
};

export const { addTodo, toggleComplete, deleteTodo, editTodo } = todoSlice.actions;
export default todoSlice.reducer;