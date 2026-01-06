import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';


function Todo() {

  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = () => {
    if (!task || !date || !time) return;

    setLoading(true);

    const newTask = {
      id: Date.now(),
      task,
      date,
      time,
    };

    setTimeout(() => {

      setTodos((prev) => [...prev, newTask]);

      setTask("");
      setDate("");
      setTime("");

      setLoading(false);
    }, 500);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  }
  const handleUpdate = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, task: editTask } : todo
      )
    );
    setEditId(null);
    setEditTask("");
  };

  const isOverdue = (todo) => {
    const deadline = new Date(`${todo.date}T${todo.time}`);
    const now = new Date();
    return now > deadline;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTodos((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);


  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4, p: 3,
          border: "1px solid grey",
          borderRadius: 2, display: "flex",
          flexDirection: "column", gap: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Todo App
        </Typography>

        <TextField
          label="Enter a Task" variant="outlined" fullWidth value={task} onChange={(e) => setTask(e.target.value)}
        />

        <TextField
          label="Enter a deadline" type="date" variant="outlined" fullWidth value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Enter a deadline" type="time" variant="outlined" fullWidth value={time} onChange={(e) => setTime(e.target.value)} InputLabelProps={{ shrink: true }}

        />

        <LoadingButton variant="contained" size="large" loading={loading} disabled={loading} onClick={handleAddTask}>
          Add
        </LoadingButton>

        {todos.map((todo) => (
          <Box
            key={todo.id}
            sx={{
              border: "1px solid #ccc",
              p: 2,
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              {editId === todo.id ? (
                <TextField size="small" value={editTask} onChange={(e) => setEditTask(e.target.value)}
                />
              ) : (
                <Typography color={isOverdue(todo) ? "error" : "text.primary"}>{todo.task}</Typography>
              )}
              <Typography variant="caption" color={isOverdue(todo) ? "error" : "text.primary"}>
                {todo.date} {todo.time}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {editId === todo.id ? (
                <Button size="small" variant="outlined" onClick={() => handleUpdate(todo.id)}>
                  Save
                </Button>
              ) : (
                <Button size="small" variant="outlined" onClick={() => handleEdit(todo)}>
                  Edit
                </Button>
              )}
              <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(todo.id)}>
                Delete
              </Button>

            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  )
}
export default Todo