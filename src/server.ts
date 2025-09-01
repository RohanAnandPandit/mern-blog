
// Import required modules
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import admin from "firebase-admin";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


// Get current file and directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load Firebase service account credentials
var serviceAccount = JSON.parse(fs.readFileSync("./credentials.json", 'utf-8'));


// Initialise Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


// Create Express app
const app = express();


// Parse incoming JSON requests
app.use(express.json());


// Database instance
let db: any;


// Connect to MongoDB (local or Atlas)
async function connectToDB() {
    const uri = process.env.MONGODB_CONNECTION_URI ?? 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri, { 
        serverApi: { 
            version: ServerApiVersion.v1,
            strict: true, 
            deprecationErrors: true,
        }, 
    } as any);

    await client.connect();
    db = client.db('mern-blog');
}


// Serve static files from frontend build
app.use(express.static(path.join(__dirname, 'front-end', 'dist')));


// Serve index.html for all non-API routes (SPA support)
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'dist', 'index.html'));
});



// Get article by name
app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const article = await db.collection('articles').findOne({ name });

        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.json(article);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Auth middleware
// NOTE: Express converts all header names to lowercase.
// So 'authtoken' header must be accessed as 'req.headers.authtoken'.
app.use(async function (req, res, next) {
    const { authtoken } = req.headers;

    if (!authtoken) return res.sendStatus(400);

    // Verify Firebase ID token
    const user = await admin.auth().verifyIdToken(authtoken as string);
    // @ts-ignore
    req.user = user;

    next();
});


// Upvote an article (only once per user)
app.post('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = (req as any).user;

    if (!uid) return res.sendStatus(401);

    const article = await db.collection('articles').findOne({ name });

    // Prevent duplicate upvotes
    if (article.upvoteIds?.includes(uid)) {
        return res.sendStatus(403);
    }

    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        { $push: { upvoteIds: uid }, $inc: { upvotes: 1 } },
        { returnDocument: 'after' },
    );

    res.json(updatedArticle);
});


// Add a comment to an article
app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const comment = req.body;
    const article = await db.collection('articles').findOneAndUpdate(
        { name },
        { $push: { comments: comment } },
        { returnDocument: 'after' },
    );

    res.json(article);
});


// Set server port
const PORT = process.env.PORT || 8000;


// Start the server after connecting to MongoDB
async function start() {
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

start();