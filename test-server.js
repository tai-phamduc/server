const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
