# 📚 Sura Library Management System (Pro Edition)

A high-performance, full-stack **MERN** application designed for modern library administration. This system integrates physical inventory tracking with digital asset distribution, featuring a fully autonomous background worker for financial auditing and notifications.

## 🚀 Key Business Features
- **Hybrid Asset Management**: Capability to manage physical inventory levels alongside digital "Software Copy" (PDF/E-book) distribution.
- **Autonomous Financial Engine**: Automated $5/day fine calculation logic with a "One-Click Settle" payment simulation.
- **Enterprise-Grade Automation**: Implemented `node-cron` background workers to perform midnight system audits and trigger overdue notifications.
- **Role-Based Access Control (RBAC)**: Distinct permission tiers for **Admins** (Full control), **Librarians** (Inventory management), and **Students** (Self-service borrowing).
- **Master Audit Trail**: A persistent, transparent ledger recording every transaction, return timestamp, and administrative override.

## 🛠️ Technical Architecture
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide-React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Identity & Security**: Clerk Authentication (OAuth + Email/Password).
- **Automation**: Node-Cron for scheduled tasks.
- **Communication**: Nodemailer via SMTP for real-time transaction alerts.

## 🛡️ Security Measures
- **CORS Protection**: Strict origin-sharing policies for production environments.
- **Environment Isolation**: Secure management of API keys and database credentials.
- **Data Integrity**: Schema-level validation and unique ISBN indexing to prevent data collisions.

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sura2017/sura-library-management.git