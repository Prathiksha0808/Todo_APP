import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { v4 as uuidv4 } from 'uuid';

// Styles
const Wrapper = styled(Box)({
  marginTop: "14px",
  padding: "13px",
  border: "1px solid grey",
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

const TodoContainer = styled(Box)({
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const ButtonContainer=styled(Box)({
  display:"flex",
  gap:"8px",
});

// Main render function
function Todo() {
  // States
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  // Creates new tasks
  const handleAddTask = () => {
    if (!task || !date || !time) return;
    const deadline = new Date(`${date}T${time}`).getTime();

    const newTodo = {
      id: uuidv4(),
      task,
      date,
      time,
      isDue: deadline < Date.now(),
    };


    setTodos((prev) => [...prev, newTodo]);
    setTask("");
    setDate("");
    setTime("");
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Enables editing of existing tasks
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  };

  // Updates existing tasks
  const handleUpdate = (id) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, task: editTask } : todo))
    );
    setEditId(null);
    setEditTask("");
  };

  // Helper to check if task is overdue
  useEffect(() => {
    const interval = setInterval(() => {
      setTodos((prev) =>
        prev.map((todo) => {
          const deadline = new Date(`${todo.date}T${todo.time}`).getTime();
          return {
            ...todo,
            isDue: deadline < Date.now(),
          };
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);



  return (
    <Container maxWidth="sm">
      <Wrapper>
        <Typography variant="h4" align="center">
          Todo App
        </Typography>

        <TextField
          label="Enter a Task"
          variant="outlined"
          fullWidth
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <TextField
          label="Enter a deadline"
          type="date"
          variant="outlined"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Enter a deadline"
          type="time"
          variant="outlined"
          fullWidth
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <LoadingButton
          variant="contained"
          size="large"
          fullWidth
          onClick={handleAddTask}
        >
          Add
        </LoadingButton>

        {todos.map((todo) => (
          <TodoContainer key={todo.id}>
            <Box>
              {editId === todo.id ? (
                <TextField
                  size="small"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
              ) : (
                <Typography color={todo.isDue ? "error" : "text.primary"}>
                  {todo.task}
                </Typography>
              )}
              <Typography
                variant="caption"
                color={todo.isDue ? "error" : "text.primary"}
              >
                {todo.date} {todo.time}
              </Typography>
            </Box>
            <ButtonContainer>
              {editId === todo.id ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleUpdate(todo.id)}
                >
                  Save
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEdit(todo)}
                >
                  Edit
                </Button>
              )}
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </Button>
            </ButtonContainer>
          </TodoContainer>
        ))}
      </Wrapper>
    </Container>
  );
}
export default Todo;
