const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your_jwt_secret"; // Use a strong secret in production

app.use(cors());
app.use(bodyParser.json());

// Mock database for demonstration (in production, use a real database)
const users = [];

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token });
});

// Protected route example
app.get('/dashboard', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ message: "Welcome to your dashboard", user: decoded.username });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
