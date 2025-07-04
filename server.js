const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// 🔹 Inventory Submission
app.post('/submit-inventory', (req, res) => {
  const { product_id, product_name, stock } = req.body;
  const sql = `
    INSERT INTO inventory (product_id, product_name, stock)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE stock = ?, product_name = ?`;
  db.query(sql, [product_id, product_name, stock, stock, product_name], (err) => {
    if (err) {
      console.error('❌ Inventory Insert Error:', err);
      return res.status(500).send('❌ Error updating inventory');
    }
    res.send('✅ Inventory updated successfully');
  });
});

// 🔹 Delivery Submission
app.post('/submit-delivery', (req, res) => {
  const { order_id, destination, priority } = req.body;
  const zoneMap = {
    'Delhi': 'Zone-1',
    'Mumbai': 'Zone-2',
    'Chennai': 'Zone-3',
    'Bangalore': 'Zone-4',
    'Hyderabad': 'Zone-5',
  };
  const distance_km = Math.floor(Math.random() * 100);
  const route = zoneMap[destination] || `Zone-${distance_km % 5 + 1}`;
  const sql = `
    INSERT INTO delivery (order_id, destination, distance_km, priority, route)
    VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [order_id, destination, distance_km, priority, route], (err) => {
    if (err) {
      console.error('❌ Delivery Insert Error:', err);
      return res.status(500).send('❌ Error optimizing delivery');
    }
    res.send(`✅ Delivery optimized via ${route}`);
  });
});

// 🔹 Get Inventory (API)
app.get('/api/inventory', (req, res) => {
  db.query('SELECT * FROM inventory', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching inventory');
    }
    res.json(results);
  });
});

// 🔹 Get Delivery (API)
app.get('/api/delivery', (req, res) => {
  db.query('SELECT * FROM delivery', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching delivery');
    }
    res.json(results);
  });
});

// 🔹 Delete Delivery by ID
app.delete('/api/delivery/:order_id', (req, res) => {
  const { order_id } = req.params;
  db.query('DELETE FROM delivery WHERE order_id = ?', [order_id], (err) => {
    if (err) {
      console.error('❌ Delete Error:', err);
      return res.status(500).send('Failed to delete delivery');
    }
    res.send('✅ Delivery deleted');
  });
});

app.listen(PORT, () => {
  console.log(`✅ Connected to MySQL`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
