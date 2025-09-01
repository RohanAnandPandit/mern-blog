# MERN Blog Setup Guide

This guide provides step-by-step instructions for setting up and running the MERN Blog project, including the React frontend, Express backend, MongoDB (local and Atlas), Firebase authentication, and deployment to Google Cloud Platform.

---

## 1. Prerequisites

- [Node.js & npm](https://nodejs.org/en/) (v18+ recommended)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (for local development)
- [Firebase Project](https://console.firebase.google.com/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

---

## 2. Setting Up the Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd src/front-end
npm install
```

To start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## 3. Setting Up the Express Backend

Install backend dependencies from the project root:

```bash
npm install
```

To run the backend in development mode (with auto-reload):

```bash
npm run dev
```

To run the backend in production mode:

```bash
npm run start
```

The backend will run on [http://localhost:8000](http://localhost:8000).

---

## 4. Setting Up MongoDB Locally

1. Install MongoDB Community Edition and start the service:
	- On macOS (with Homebrew):
	  ```bash
	  brew tap mongodb/brew
	  brew install mongodb-community@6.0
	  brew services start mongodb-community@6.0
	  ```
2. The backend connects to MongoDB at `mongodb://127.0.0.1:27017` by default.
3. No further configuration is needed for local development.

---

## 5. Hosting MongoDB on Atlas

1. [Create a free MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register).
2. Create a new cluster and database (e.g., `mern-blog`).
3. Create a database user and password.
4. Obtain your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern-blog?retryWrites=true&w=majority`).
5. Set the environment variable in your deployment or local `.env` file:
	```env
	MONGODB_CONNECTION_URI="your-mongodb-atlas-connection-string"
	```
6. For Google Cloud deployment, update `prod-env.yaml` with your Atlas URI, username, and password.

---

## 6. Setting Up Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Email/Password** authentication in the Authentication section.
3. In the frontend, update `src/front-end/src/main.jsx` with your Firebase config:
	```js
	const firebaseConfig = {
	  apiKey: "...",
	  authDomain: "...",
	  projectId: "...",
	  storageBucket: "...",
	  messagingSenderId: "...",
	  appId: "..."
	};
	```
4. Download your service account key from Firebase Console and save it as `credentials.json` in the project root for backend admin SDK.

---

## 7. Deploying to Google Cloud Platform (GCP)

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and authenticate:
	```bash
	gcloud auth login
	gcloud config set project <your-gcp-project-id>
	```
2. Ensure `app.yaml` and `prod-env.yaml` are configured with your environment variables and entrypoint.
3. Build the project:
	```bash
	npm run build
	```
4. Deploy to GCP App Engine:
	```bash
	gcloud app deploy
	```
5. To browse your deployed app:
	```bash
	gcloud app browse
	```

- Ensure that the service account for your app has the `Storage Object Admin` role.
- Ensure that there is a billing account associated with your project.

---

## 8. Useful Commands

| Command                        | Description                                 |
|--------------------------------|---------------------------------------------|
| `npm run dev`                  | Start backend in development mode           |
| `npm run start`                | Start backend in production mode            |
| `npm run build`                | Build frontend and backend                  |
| `cd src/front-end && npm run dev` | Start frontend dev server                |
| `gcloud app deploy`            | Deploy to Google Cloud Platform             |
| `gcloud app browse`            | Open deployed app in browser                |

---

## 9. Notes

- Ensure your `credentials.json` and sensitive environment variables are **never committed to version control**.
- For production, always use secure passwords and restrict access to your MongoDB Atlas cluster.
- For troubleshooting, check logs in the GCP Console and use `gcloud app logs tail -s default`.

---

## 10. Project Structure

```
mern-blog/
├── app.yaml
├── credentials.json
├── package.json
├── prod-env.yaml
├── README.md
├── tsconfig.json
├── src/
│   ├── server.ts
│   └── front-end/
│       ├── package.json
│       ├── vite.config.js
│       ├── src/
│       │   ├── main.jsx
│       │   ├── App.jsx
│       │   ├── ...
```
