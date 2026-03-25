import app from './app';

// @desc Port
const PORT = process.env.PORT || 8001;

// @desc Start server
app.listen(PORT, () => {
  console.log(`Inventory Database Server running on port ${PORT}`);
});
