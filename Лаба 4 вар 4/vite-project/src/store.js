import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

//упрощёное создание хранилища
const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export default store;
