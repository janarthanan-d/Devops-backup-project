# 🛡️ DevOps Backup — Recovery System

> A lightweight, self-hosted dashboard to back up your DevOps pipelines and restore them in seconds when things go wrong.

![Status](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 Overview

**DevOps Backup** is a recovery-management web app that gives teams a single place to:

- Snapshot pipeline configurations and state (**Backups**)
- Monitor backup health at a glance (**Dashboard**)
- Restore pipelines from a previous snapshot when a deployment goes sideways (**Disaster Recovery**)

Built with a clean, dark-themed UI so critical status information (success / failed / pending) is easy to scan during an incident.

---

## ✨ Features

- 🔐 **Secure authentication** — email/password login with session validation
- 📊 **Live dashboard** — total backups, success/failure counts, recoveries, and a visual backup-status breakdown
- 💾 **Backup management** — create, view, and delete pipeline backups with source, type, size, and storage location tracked
- ♻️ **Disaster recovery** — one-click "Initiate Recovery" flow with full recovery history (who initiated it, when, and the outcome)
- 🕒 **Audit trail** — every backup and recovery is timestamped and attributed to a user
- 🌙 **Dark, cinematic UI** — high-contrast status badges (`success` / `failed`) for fast triage

---

## 🖥️ Screenshots

### Login
Secure sign-in gate for the recovery console.

![Login Screen](./screenshots/login.png)

### Dashboard
System overview — total backups, success/failure counts, recoveries, and backup status at a glance.

![Dashboard](./screenshots/dashboard.png)

### Backups
Create and manage pipeline backups, with source, type, size, storage, and creation date tracked per entry.

![Backups](./screenshots/backups.png)

### Disaster Recovery
Restore pipelines from any previous backup snapshot and review recovery history.

![Disaster Recovery](./screenshots/disaster-recovery.png)

---

## 🧱 Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React (Create React App)                |
| Styling    | Custom dark theme / CSS                 |
| Auth       | Token-based (JWT) login                 |
| Realtime   | WebSocket connection for live updates   |
| Backend    | Node.js / Express *(adjust as per your setup)* |
| Database   | MongoDB *(adjust as per your setup)*    |

> ⚠️ Update this section to match your actual backend stack before publishing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn
- MongoDB instance (local or Atlas) — if using the default backend

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/devops-backup.git
cd devops-backup

# Install dependencies
npm install

# Start the app
npm start
```

The app will be available at:

```
http://localhost:3000
```

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

---

## 🗂️ Project Structure

```
devops-backup/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Backups.jsx
│   │   ├── Recovery.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   └── index.js
├── screenshots/
├── package.json
└── README.md
```

---

## 🧭 Usage

1. **Sign in** with your admin credentials.
2. From the **Dashboard**, monitor total backups, success/failure rates, and recent activity.
3. Go to **Backups** → click **+ New Backup** to snapshot a pipeline.
4. Go to **Disaster Recovery** → click **Initiate Recovery** to restore from a chosen backup (full or partial).
5. Track every action in the recovery history table (initiated by, completion time, status).

---

## 🛣️ Roadmap

- [ ] Scheduled/automated backups
- [ ] Multi-storage support (S3, GCS, local)
- [ ] Role-based access control
- [ ] Email/Slack alerts on backup failure
- [ ] Backup diff/versioning view

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork, then:
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">Made with ⚙️ for reliable DevOps recovery</p>
