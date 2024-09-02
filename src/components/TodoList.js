import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:8080/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the TODOs!', error);
      });
  };

  const handleAddTodo = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/todos', {
      title: newTodo,
      completed: false,
    })
    .then(response => {
      setTodos([...todos, response.data]); // Update the list of TODOs
      setNewTodo(''); // Clear the input field
    })
    .catch(error => {
      console.error('There was an error adding the TODO!', error);
    });
  };

  const handleToggleTodo = (id, completed) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    axios.put(`http://localhost:8080/todos/${id}`, { ...todoToUpdate, completed: !completed })
      .then(response => {
        setTodos(todos.map(todo =>
          todo.id === id ? response.data : todo
        ));
      })
      .catch(error => {
        console.error('There was an error updating the TODO!', error);
      });
  };

  const handleEditTodo = (id, title) => {
    setEditId(id);
    setEditTitle(title);
  };

  const handleUpdateTodo = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/todos/${editId}`, { title: editTitle })
      .then(response => {
        setTodos(todos.map(todo =>
          todo.id === editId ? { ...todo, title: response.data.title } : todo
        ));
        setEditId(null);
        setEditTitle('');
      })
      .catch(error => {
        console.error('There was an error updating the TODO!', error);
      });
  };

  return (
    <div>
      <h1>TODO List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <form onSubmit={handleUpdateTodo}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit TODO"
                  required
                />
                <div className="edit-buttons">
                  <button type="submit">Save</button>
                  <button type="button" className="cancel" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <span
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                >
                  {todo.title}
                </span>
                <button onClick={() => handleToggleTodo(todo.id, todo.completed)}>
                  {todo.completed ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button onClick={() => handleEditTodo(todo.id, todo.title)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new TODO"
          required
        />
        <button type="submit">Add TODO</button>
      </form>
    </div>
  );
}

export default TodoList;
