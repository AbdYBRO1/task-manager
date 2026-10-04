const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

import { upload, uploadFileToSupabase } from './services/storage.js';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');

        const safeName = decodedName.replace(/\s+/g, '_');

        const uniqueSuffix = Date.now();

        cb(null, `${uniqueSuffix}-${safeName}`);
    }
});

const upload = multer({ storage: storage });


app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: { category: true }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении задач' });
    }
});

app.post('/api/tasks', upload.array('files', 10), async (req, res) => {
    try {
        const { title, description, points, categoryId } = req.body;

        const fileUrl = [];
        const fileName = [];

        if (req.files && req.files.length > 0) {
            for(const file of req.files) {
                const uploaded = await uploadFileToSupabase(file);
                fileUrl.push(uploaded.url);
                fileName.push(uploaded.name);
            }
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                points: Number(points) || 10,
                categoryId: categoryId && categoryId !== "" ? categoryId : undefined,
                fileUrl,
                fileName
            }
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
});

app.get('/api/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { user: true }
        });
        if (!profile) {
            return res.status(404).json({ error: 'Профиль не найден' });
        }
        res.json(profile);
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.patch('/api/profile/:userId/progress', async (req, res) => {
    try {
        const { userId } = req.params;
        const { addPoints, addTime } = req.body;
        const updateProfile = await prisma.profile.update({
            where: { userId },
            data: {
                points: { increment: addPoints || 0 },
                totalTime: { increment: addTime || 0 }
            }
        });
        res.json(updateProfile);
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка при обновлении профиля' });
    }
});

// ==================== РОУТЫ КАТЕГОРИЙ ====================
// 1. Получить список всех категорий
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { tasks: true }
        });
        res.json(categories);
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        res.status(500).json({ error: 'Ошибка при получении категорий' });
    }
});

// 2. Создать новую категорию (Админский функционал)
app.post('/api/categories', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Название категории обязательно' });
        }

        const newCategory = await prisma.category.create({
            data: { name, description }
        });

        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Ошибка при создании категории:", error);
        res.status(500).json({ error: 'Категория с таким именем уже существует или произошла ошибка' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        res.json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
});

// Создание учетной записи администратором
app.post('/api/admin/users', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                role: 'USER',
                profile: {
                    create: { username: email.split('@')[0] }
                }
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Ошибка создания юзера:", error);
        res.status(500).json({ error: 'Не удалось создать пользователя' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на порту ${PORT}`);
})