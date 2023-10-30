import React, { useState, useEffect } from "react";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/apis/fake/todos/user/chrisgonvill"
      );
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } 
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (inputText.trim() !== "") {
      const isTodoExist = todos.some((todo) => todo.label === inputText);
      if (!isTodoExist) {
        const newTodo = { label: inputText, done: false };
        setTodos([...todos, newTodo]);
        setInputText("");
        await sendList([...todos, newTodo]);
      } else {
        alert("Esta tarea ya existe");
      }
    }
  };

  const sendList = async (list) => {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/apis/fake/todos/user/chrisgonvill",
        {
          method: "PUT",
          body: JSON.stringify(list),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Todo list updated successfully");
      } 
    } catch (error) {
      console.error("Error updating todo list:", error);
    }
  };

  const clearTodos = async () => {
    try {
      await sendList([]);
      setTodos([]);
    } catch (error) {
      console.error("Error clearing todo list:", error);
    }
  };

  const removeTodo = async (index) => {
    try {
      const updatedTodos = todos.filter((_, todoIndex) => todoIndex !== index);
      await sendList(updatedTodos);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  };

  const pendingTasksMessage =
    todos.length === 0
      ? "No hay tareas pendientes, añadir tareas"
      : `Tienes ${todos.length} ${
          todos.length === 1 ? "tarea" : "tareas"
        } pendientes`;

  return (
    <div className="container">
      <h1>Mi Todo List Ahora Usando React y Fetch</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
        <button className="btn btn-success" onClick={addTodo}>
          Agregar
        </button>
        <button className="btn btn-danger" onClick={clearTodos}>
          Limpiar tareas
        </button>
      </div>

      <p className="text-muted">{pendingTasksMessage}</p>

      <ul className="list-group">
        {todos.map((todo, index) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={index}
          >
            <span>{todo.label}</span>
            <button
              className="btn btn-danger btn-sm delete-button"
              onClick={() => removeTodo(index)}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
