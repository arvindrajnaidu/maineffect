import app from 'express';

app.get('/hello', (req, res) => {
  res.send(`Hello ${req.params.name}`);
});

app.post('/items', (req, res) => {
  res.json({ created: true, body: req.body });
});
