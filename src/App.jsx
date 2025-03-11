// Import Material-UI components

import React, { useState } from 'react'; 
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// Import Material-UI icons
import { Delete, Add, PieChart as PieChartIcon } from '@mui/icons-material';

// Import Recharts components with an alias
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

// Mock food database
const FOOD_DB = [
  { id: 1, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: 2, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 3, name: 'Rice (1 cup)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  { id: 4, name: 'Almonds (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState('Breakfast');
  const [openDialog, setOpenDialog] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const addEntry = () => {
    if (selectedFood) {
      const food = FOOD_DB.find(f => f.id === selectedFood);
      const newEntry = {
        ...food,
        quantity,
        mealType,
        id: Date.now()
      };
      setEntries([...entries, newEntry]);
      setSelectedFood('');
      setQuantity(1);
    }
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const addCustomFood = () => {
    const newFood = {
      id: Date.now(),
      ...customFood,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein),
      carbs: Number(customFood.carbs),
      fat: Number(customFood.fat)
    };
    FOOD_DB.push(newFood);
    setOpenDialog(false);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0);
  const macroData = [
    { name: 'Protein', value: entries.reduce((sum, entry) => sum + (entry.protein * entry.quantity), 0) },
    { name: 'Carbs', value: entries.reduce((sum, entry) => sum + (entry.carbs * entry.quantity), 0) },
    { name: 'Fat', value: entries.reduce((sum, entry) => sum + (entry.fat * entry.quantity), 0) }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Calorie Tracker
          <PieChartIcon style={{ float: 'right' }} />
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(meal => (
                  <MenuItem key={meal} value={meal}>{meal}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Select Food</InputLabel>
              <Select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
              >
                {FOOD_DB.map(food => (
                  <MenuItem key={food.id} value={food.id}>
                    {food.name} ({food.calories} cal)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={2}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Add />}
              onClick={addEntry}
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>

        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => setOpenDialog(true)}
        >
          Add Custom Food
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Daily Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              Total Calories: {totalCalories}
            </Typography>
            <List>
              {entries.map(entry => (
                <ListItem
                  key={entry.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteEntry(entry.id)}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${entry.quantity}x ${entry.name}`}
                    secondary={`${entry.calories * entry.quantity} cal (${entry.mealType})`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <RechartsPieChart width={400} height={300}>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {macroData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Custom Food</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Food Name"
                fullWidth
                value={customFood.name}
                onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Calories"
                type="number"
                fullWidth
                value={customFood.calories}
                onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Protein (g)"
                type="number"
                fullWidth
                value={customFood.protein}
                onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Carbs (g)"
                type="number"
                fullWidth
                value={customFood.carbs}
                onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fat (g)"
                type="number"
                fullWidth
                value={customFood.fat}
                onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={addCustomFood} color="primary">Add Food</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}