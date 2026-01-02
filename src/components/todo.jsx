import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Todo(){
return(
    <Container maxWidth="sm">
    <Box
      sx={{mt: 4,p: 3,
        border: "1px solid grey",
        borderRadius: 2,display: "flex",
        flexDirection: "column",gap: 2,
      }}
    >
      <Typography variant="h4" align="center">
        Todo App
      </Typography>

      <TextField
        label="Enter a Task" variant="outlined" fullWidth
      />

      <TextField
        label="Enter a deadline" type="time" variant="outlined" fullWidth
      />

      <Button variant="contained" size="large">
        Add
      </Button>
    </Box>
  </Container>
)
}
export default Todo