import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Todo from './Todo';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <h1>Todo App with Deadlines</h1>
        <Todo />
      </div>
    </Provider>
  );
};

export default App;