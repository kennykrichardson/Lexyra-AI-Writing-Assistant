# 🪶 Lexyra · Thoughtfully Written

**Better writing, without losing your voice.**

Lexyra is an AI-powered writing enhancer that helps transform rough drafts into clear, confident, and polished writing without losing the author's original meaning. ✨

Whether you're refining a professional email, tightening a resume bullet, improving an academic paragraph, or expressing an idea more clearly, Lexyra helps you find the right words. 💬

## 🌟 Features

- ✍️ **AI-powered writing enhancement** — refine rough drafts into polished prose.
- 🎯 **Multiple writing styles** — choose the tone that fits your needs.
- 💼 **Professional** — polished, workplace-ready communication.
- 💎 **Articulate** — clearer and more precise expression.
- ⚡ **Concise** — fewer words, same meaning.
- 🚀 **Confident** — direct and assured communication.
- 📄 **Recruiter-friendly** — writing suited to resumes and job applications.
- 🎓 **Academic** — formal and precise language.
- 📋 **One-click copying** — copy enhanced text quickly.
- 🔄 **Regeneration** — generate another version when needed.
- 🧠 **Meaning-first philosophy** — improve expression without inventing qualifications or experience.
- 🎨 **Thoughtful interface** — a clean, typography-focused design with subtle visual details.
- 📱 **Responsive layout** — designed to work across supported screen sizes.

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚛️ React
- 🟦 TypeScript
- ⚡ Vite
- 🎭 Framer Motion
- 🧩 Lucide React

### ⚙️ Backend
- 🐍 Python
- 🚀 FastAPI
- 🦄 Uvicorn
- 🤗 Cloudflare model integration

### ☁️ Deployment
- ▲ Render for the frontend
- 🚀 Render for the backend

*Deployment providers and model integrations may change as the project evolves.*

## 🏗️ Project Structure

```text
Lexyra/
├── backend/
│   ├── app/
│   │   ├── lexyra.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── prompts.py
│   │   └── cloudflare.py
│   ├── tests/
│   │   └── test_api.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── .gitignore
├── LICENSE
└── README.md
```

📌 This tree reflects the intended project structure. Keep it aligned with the actual files in the repository.

## 🚀 Getting Started

### 📋 Prerequisites

Install the following before running Lexyra locally:

- 🐍 Python 3.10 or newer, subject to your dependency and deployment compatibility.
- 🟢 Node.js and npm.
- 🔑 A Clouflare access token if required by your configured model.
- 🌐 Git.

### 1️⃣ Clone the repository

```bash
git clone https://github.com/kennykrichardson/Lexyra-ai-writing-assistant.git
cd Lexyra
```

Replace the repository URL if the GitHub repository uses a different name.

### 2️⃣ Configure the backend

```bash
cd backend
python -m venv .lexyra
```

Activate the environment.

**Windows PowerShell:**

```powershell
.lexyra\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
source .lexyra/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your local environment file using `.env.example` as the template. Configure the variables supported by your backend:

```dotenv
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_id
CLOUDFLARE_MODEL=@cf/meta/llama-3.1-8b-instruct
FRONTEND_ORIGIN=http://localhost:5173
MAX_INPUT_CHARS=10000
```

⚠️ Use the actual model ID and configuration expected by your backend. Never commit `.env` or expose private tokens in frontend code.

Start the API:

```bash
uvicorn app.lexyra:app --reload
```

The API should now be available at `http://127.0.0.1:8000`, provided the application starts successfully.

### 3️⃣ Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL, typically `http://localhost:5173`.

🔌 Ensure the frontend API configuration points to your local backend. Use the environment variable or configuration mechanism implemented in the current frontend code.

## 🌍 Deployment

### ▲ Frontend: Vercel

1. Import the GitHub repository into Vercel.
2. Set the frontend root directory to `frontend`.
3. Configure the build command according to `frontend/package.json`, typically `npm run build`.
4. Set the output directory to `dist`.
5. Configure the production API URL using the environment variable expected by your frontend.
6. Deploy and verify the live application.

### 🚀 Backend: Render

1. Create a new Render Web Service connected to the repository.
2. Set the root directory to `backend` if the backend contains its own `requirements.txt`.
3. Set the build command to:

   ```bash
   pip install -r requirements.txt
   ```

4. Set the start command to:

   ```bash
   uvicorn app.lexyra:app --host 0.0.0.0 --port $PORT
   ```

5. Add the required backend environment variables in Render's dashboard.
6. Configure the frontend origin for CORS.
7. Deploy and inspect the service logs.

🩺 If the backend exposes `/api/health`, use the deployed health endpoint to verify service availability.

## 🔐 Security and Privacy

- 🔑 Keep API tokens and secrets on the backend.
- 🚫 Never commit `.env` files or private credentials.
- 🛡️ Restrict CORS to trusted frontend origins in production.
- 📏 Validate incoming text and enforce reasonable input limits.
- 🧪 Test error handling, malformed requests, and unavailable model services.
- 🧾 Avoid logging sensitive user-submitted text unnecessarily.

## 🧪 Testing

Run the backend tests from the backend directory:

```bash
pytest
```

Build the frontend before release:

```bash
cd frontend
npm run build
```

✅ Verify the writing styles, input validation, loading and error states, copy functionality, and backend connectivity before shipping.

## 🧭 Project Philosophy

Lexyra is built around a simple principle:

> Better writing should strengthen your voice, not replace it.

The goal is to improve clarity, grammar, vocabulary, and flow while respecting the user's original intent. 🪶

## 🗺️ Roadmap

Potential future improvements include:

- 🧠 More precise control over tone and writing intensity.
- 🌐 Additional language support.
- 📚 More writing presets for different use cases.
- 🧪 Expanded automated testing.
- ♿ Further accessibility improvements.
- ⚡ Continued performance and reliability improvements.

## 👨‍💻 Author

**Kenny Richardson Kodipally**

- 🐙 GitHub: [@kennykrichardson](https://github.com/kennykrichardson)
- 💼 LinkedIn: [Kenny Richardson](https://linkedin.com/in/kennykrichardson)

## 📄 License

Lexyra is distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

🪶 **Lexyra · Thoughtfully Written**

*Your ideas. Just expressed better.*