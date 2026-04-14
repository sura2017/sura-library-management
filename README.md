# 📚 Sura Library Management System (Pro Edition)

A high-performance, full-stack **MERN** application designed for modern library administration. This system bridges the gap between physical inventory tracking and digital asset distribution, featuring a fully autonomous background engine for financial auditing and automated student communication.

## 🚀 Key Business Features
- **Hybrid Asset Management**: Manage physical book stock levels alongside digital "Software Copy" (PDF/E-book) links.
- **Autonomous Financial Engine**: Automated $5/day fine calculation logic with a "One-Click Settle" payment simulation for librarians.
- **Role-Based Access Control (RBAC)**: Distinct permission tiers for **Admins** (Full System Control), **Librarians** (Inventory & Loans), and **Students** (Catalog & Self-Service).
- **Master Audit Trail**: A persistent, transparent ledger recording every transaction, specific return timestamps, and administrative deadline overrides.
- **Smart Search**: Real-time filtering system for large catalogs using title, author, or ISBN.

## 📧 Automated Email Workflow (SMTP Integration)
The system features a 3-stage automated notification lifecycle powered by **Nodemailer** and **Node-Cron**:
1. **Borrowing Confirmation**: Instant email receipt upon checkout including book title and specific due date.
2. **Return Verification**: Automatic "Thank You" email triggered the second a book is returned, logging the official return timestamp.
3. **Overdue Alerts (Autonomous)**: A midnight background worker scans the database daily. If a book is past its deadline, a "Late Notice" is automatically dispatched to the student's inbox.

## 🛠️ Technical Architecture
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide-React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Identity**: Clerk Authentication (OAuth 2.0 + Email/Password).
- **Automation**: Node-Cron for scheduled system audits.
- **Communication**: SMTP via Nodemailer for real-time alerts.

## 🛡️ Security & Production Readiness
- **CORS Protection**: Strict origin-sharing policies for cloud security.
- **Safety Logic**: "Bulletproof" controller functions that handle deleted or broken data without system crashes.
- **Responsive UI**: Fully optimized for mobile, tablet, and desktop library environments.

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sura2017/sura-library-management.git