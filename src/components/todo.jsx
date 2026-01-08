import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/system";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

// Styles
const TodoContainer = styled(Box)(({ isdue }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginTop: "16px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderLeft: isdue === "true" ? "6px solid #e53e3e" : "6px solid #48bb78",
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
  },
}));

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

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  paddingTop: 0,
});

const Wrapper = styled(Box)({
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0px 15px 35px rgba(0,0,0,0.05)",
  backgroundColor: "#ffffff",
});

const MainCard = styled(Box)({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "24px",
  marginTop: 0,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
});

// Validation schema
const todoschema = yup.object({
  task: yup
    .string()
    .required("Task is required")
    .matches(/^\S.*$/, "Task cannot start with a space"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
});

// Main render function
function Todo() {
  // States
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  // Today's date and time for validation
  const today = new Date().toISOString().split("T")[0];
  const nowTime = new Date().toTimeString().slice(0, 5);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(todoschema),
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm({
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
      alerted: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    reset();
    setTimeout(checkOverdueTasks, 0);
  };

  //delete todo
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
              alerted: false,
            }
          : todo
      )
    );
    setEditId(null);
  };

  // Checks all todos to determine whether they are overdue.
  const checkOverdueTasks = () => {
    const overdueTasks = [];
    setTodos((prev) =>
      prev.map((todo) => {
        const deadline = new Date(`${todo.date}T${todo.time}`).getTime();
        const overdue = deadline < Date.now();

        if (overdue && !todo.alerted) {
          overdueTasks.push(todo.task);
          return { ...todo, isDue: true, alerted: true };
        }
        return { ...todo, isDue: overdue };
      })
    );
    //alert for overdue tasks
    if (overdueTasks.length) {
      setTimeout(() => {
        overdueTasks.forEach((task) => alert(`Task "${task}" is overdue!`));
      }, 0);
    }
  };

  //check overdue tasks every minute
  useEffect(() => {
    const interval = setInterval(checkOverdueTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageWrapper>
        <Container maxWidth="sm" sx={{ pt: 4 }}>
          <MainCard>
            <Wrapper>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormContainer>
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
                    inputProps={{
                      min: today,
                    }}
                  />

                  <TextField
                    label="Enter time"
                    type="time"
                    variant="outlined"
                    fullWidth
                    {...register("time")}
                    error={!!errors.time}
                    helperText={errors.time?.message}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: watch("date") === today ? nowTime : undefined,
                    }}
                  />

                  <LoadingButton
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    sx={{ backgroundColor: " #2563eb" }}
                  >
                    Add
                  </LoadingButton>
                </FormContainer>
              </form>

              {todos.map((todo) => {
                const deadline = new Date(
                  `${todo.date}T${todo.time}`
                ).getTime();
                const isOverdue = deadline < Date.now();

                return (
                  <TodoContainer key={todo.id} isdue={isOverdue.toString()}>
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
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
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
                          <Typography
                            color={isOverdue ? "error" : "text.primary"}
                          >
                            {todo.task}
                          </Typography>

                          <Typography
                            variant="caption"
                            color={isOverdue ? "error" : "text.secondary"}
                          >
                            {dayjs(`${todo.date} ${todo.time}`).format(
                              "MMM Do, YYYY HH:mm A"
                            )}
                          </Typography>
                        </Box>

                        <ButtonContainer>
                          <Button
                            variant="outlined"
                            onClick={() => handleEdit(todo)}
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => handleDelete(todo.id)}
                          >
                            Delete
                          </Button>
                        </ButtonContainer>
                      </>
                    )}
                  </TodoContainer>
                );
              })}
            </Wrapper>
          </MainCard>
        </Container>
      </PageWrapper>
    </>
  );
}
export default Todo;
