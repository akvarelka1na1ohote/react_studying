

import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

const Buttons = ({ count = 5 }) => {
  // Создаем массив счетчиков и состояние для хранения индекса последней нажатой кнопки
  const [counters, setCounters] = useState(Array(count).fill(0));
  const [lastClickedIndex, setLastClickedIndex] = useState(null);

  // Функция для обработки клика по кнопке
  const handleClick = (index) => {
    const newCounters = [...counters];
    newCounters[index] += 1; // Увеличиваем счетчик на единицу
    setCounters(newCounters);
    setLastClickedIndex(index); // Запоминаем индекс последней нажатой кнопки
  };

  return (
    <div className="d-flex flex-row align-items-start gap-2">
      {counters.map((counter, index) => (
        <button
          key={index}
          className={`btn ${lastClickedIndex === index ? 'btn-success' : 'btn-primary'} mb-2`}
          onClick={() => handleClick(index)}
        >
          {counter}
        </button>
      ))}
    </div>
  );
};

export default Buttons;