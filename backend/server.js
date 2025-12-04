const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = 'users.json';

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }
        return [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

app.post('/register/', (req, res) => {
    try {
        const { email, password, role, name, phone, graduationYear, studyYear, degreeType, collegeName } = req.body;
        
        if (!email || !password || !role) {
            return res.json({ status: 'error', detail: 'Missing registration fields.' });
        }
        
        const users = loadUsers();
        if (users.find(u => u.email === email)) {
            return res.json({ status: 'error', detail: 'User already exists.' });
        }
        
        const userData = {
            email,
            password: hashPassword(password),
            role,
            history: []
        };
        
        if (role === 'job_seeker') {
            userData.name = name || '';
            userData.phone = phone || '';
            userData.graduation_year = graduationYear || '';
            userData.study_year = studyYear || '';
            userData.degree_type = degreeType || '';
            userData.college_name = collegeName || '';
        }
        
        users.push(userData);
        saveUsers(users);
        res.json({ status: 'registered', email, role });
    } catch (error) {
        console.error('Registration error:', error);
        res.json({ status: 'error', detail: 'Registration failed.' });
    }
});

app.post('/login/', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.json({ status: 'error', detail: 'Missing login fields.' });
        }
        
        const users = loadUsers();
        const user = users.find(u => u.email === email && u.password === hashPassword(password));
        
        if (!user) {
            return res.json({ status: 'error', detail: 'Invalid credentials.' });
        }
        
        res.json({ status: 'success', email: user.email, role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ status: 'error', detail: 'Login failed.' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});