import app from './app';

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Inventory Database Server running on port ${PORT}`);
});
