import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";



// Styles
const Wrapper = styled(Box)({
  marginTop: "16px",
  border: "1px solid grey",
  borderRadius: 4,
  padding: "16px",
});


const TodoContainer = styled(Box)({
  border: "1px solid #ccc",
  padding: "12px",
  borderRadius: 4,
  marginTop: "12px",
  display: "flex",
  flexDirection: "row",
  gap: "12px",
});


const ButtonContainer = styled(Box)({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
});

const EditForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
});



// Validation schema
const todoschema = yup.object({
  task: yup.string().required("Task is required").matches(/^\S.*$/, "Task cannot start with a space"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
})

// Main render function
function Todo() {
  // States
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);



  const { register, handleSubmit, reset, formState: { errors }, } = useForm({
    resolver: yupResolver(todoschema),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors }, } = useForm({
      resolver: yupResolver(todoschema),
    });


  // Creates new tasks
  const onSubmit = (data) => {
    const { task, date, time } = data;
    const deadline = new Date(`${date}T${time}`).getTime();

    const newTodo = {
      id: uuidv4(),
      task,
      date,
      time,
      isDue: deadline < Date.now(),
    };

    setTodos((prev) => [...prev, newTodo]);
    reset();
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Enables editing of existing tasks
  const handleEdit = (todo) => {
    setEditId(todo.id);
    resetEdit({
      task: todo.task,
      date: todo.date,
      time: todo.time,
    });
  };


  // Updates existing tasks
  const onEditSubmit = (data) => {
  const { task, date, time } = data;

  const deadline = new Date(`${date}T${time}`).getTime();
  const isDue = deadline < Date.now(); 

  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === editId
        ? {
            ...todo,
            task,
            date,
            time,
            isDue, 
          }
        : todo
    )
  );

  setEditId(null);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer>
            <Typography variant="h4" align="center">
              Todo App
            </Typography>

            <TextField
              label="Enter a Task"
              variant="outlined"
              fullWidth
              {...register("task")}
              error={!!errors.task}
              helperText={errors.task?.message}
            />

            <TextField
              label="Enter a deadline"
              type="date"
              variant="outlined"
              fullWidth
              {...register("date")}
              error={!!errors.date}
              helperText={errors.date?.message}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Enter a deadline"
              type="time"
              variant="outlined"
              fullWidth
              {...register("time")}
              error={!!errors.time}
              helperText={errors.time?.message}
              InputLabelProps={{ shrink: true }}
            />

            <LoadingButton
              variant="contained"
              size="large"
              fullWidth
              type="submit">
              Add
            </LoadingButton>
          </FormContainer>
        </form>



        {todos.map((todo) => (
          <TodoContainer key={todo.id}>
            {editId === todo.id ? (
              <EditForm onSubmit={handleEditSubmit(onEditSubmit)}>
                <TextField
                  size="small"
                  label="Task"
                  fullWidth
                  {...editRegister("task")}
                  error={!!editErrors.task}
                  helperText={editErrors.task?.message}
                />

                <TextField
                  size="small"
                  type="date"
                  fullWidth
                  {...editRegister("date")}
                  error={!!editErrors.date}
                  helperText={editErrors.date?.message}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  size="small"
                  type="time"
                  fullWidth
                  {...editRegister("time")}
                  error={!!editErrors.time}
                  helperText={editErrors.time?.message}
                  InputLabelProps={{ shrink: true }}
                />

                <ButtonContainer>
                  <Button type="submit" size="small" variant="outlined">
                    Save
                  </Button>
                </ButtonContainer>
              </EditForm>
            ) : (

              <>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color={todo.isDue ? "error" : "text.primary"}>
                    {todo.task}
                  </Typography>

                  <Typography
                    variant="caption"
                    color={todo.isDue ? "error" : "text.secondary"}
                  >
                    {todo.date} {todo.time}
                  </Typography>

                </Box>

                <ButtonContainer>
                  <Button variant="outlined" onClick={() => handleEdit(todo)}>Edit</Button>
                  <Button color="error" variant="outlined" onClick={() => handleDelete(todo.id)}>
                    Delete
                  </Button>
                </ButtonContainer>
              </>
            )}
          </TodoContainer>

        ))}
      </Wrapper>

    </Container>
  );
}
export default Todo;
