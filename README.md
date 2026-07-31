# 🍽️ VibeBite – AI-Powered Smart Restaurant Management System

> 🚀 **Submission for VibeAthon 6.0 (VibeCoding Hackathon)** by **NxtGenSec**

VibeBite is a next-generation Smart Restaurant Management System designed to enhance the dining experience while simplifying restaurant operations. The platform combines AI assistance, digital ordering, role-based dashboards, and real-time order management into one seamless solution.

---

# 🌐 Project Links

### Live Demo
**https://smart-restaurant-management-system-six.vercel.app/login** 

---

# 👥 Team Details

**Team Name:** Sukanya

**Team Lead:** Sukanya

**Team Members**

- Smridhi Kaur
- Balpreet Kaur

---

# 🌟 Project Overview

VibeBite transforms the traditional restaurant workflow into a fully digital, AI-assisted ecosystem.

The platform enables customers to browse menus digitally, place orders, verify their identity using OTP authentication, track orders in real time, and receive AI-powered assistance. Restaurant staff can efficiently manage orders through dedicated Admin, Staff, and Kitchen dashboards, ensuring smooth communication between all departments.

---

# ✨ Key Features

## 🍽 Customer Experience

- Customer Login
- OTP Authentication
- Digital Menu
- Category-wise Food Browsing
- Smart Search & Filters
- Add to Cart
- Cart Management
- Secure Checkout
- Live Order Tracking
- Order Status Updates
- AI Restaurant Assistant

---

## 🏢 Restaurant Portal

A dedicated portal provides secure access for restaurant employees.

### 👑 Admin

- Secure Login
- Dashboard Overview
- Restaurant Analytics
- Menu Management
- Staff Management
- Inventory Monitoring
- Order Monitoring

### 👨‍🍳 Staff

- Secure Login
- View Incoming Orders
- Manage Customer Requests
- Update Order Status
- Table Service Management

### 🍳 Kitchen

- Secure Login
- Kitchen Dashboard
- View Pending Orders
- Update Food Preparation Status
- Notify Staff When Orders Are Ready

---

# 🔐 Authentication System

The application includes a multi-level authentication flow.

## 🍽 Customer Flow


Landing Page
      │
      ▼
Login
      │
      ▼
Customer
      │
      ▼
Customer Login
      │
      ▼
OTP Verification
      │
      ▼
Digital Menu
      │
      ▼
Cart & Checkout
      │
      ▼
Order Tracking


## 🏢 Restaurant Flow


Landing Page
      │
      ▼
Login
      │
      ▼
Restaurant Portal
      │
      ▼
Admin / Staff / Kitchen
      │
      ▼
Role-Based Login
      │
      ▼
Individual Dashboard


---

# 🤖 AI Features

- AI Restaurant Assistant
- Smart Food Recommendations
- Intelligent Menu Assistance
- Interactive Customer Support
- AI-Powered Restaurant Experience

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

## Backend

- FastAPI
- Python
- Uvicorn

## Database & Storage

- Supabase
- PostgreSQL
- Supabase Storage

---

# 📂 Project Structure

```text
app/
│
├── login/
├── customer-login/
├── customer-auth/
├── portal/
├── admin-login/
├── staff-login/
├── kitchen-login/
├── menu/
├── cart/
├── checkout/
├── preparing/
├── admin/
├── staff/
├── kitchen/
└── components/
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm
- Python 3.9+
- FastAPI
- Uvicorn
- Supabase Account

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL

cd Smart-Restaurant-Management-System
```

---

## 2. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 3. Backend Setup

```bash
cd app

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn main:app --reload
```

---

# 🗄 Database Setup

1. Create a Supabase Project.
2. Open the SQL Editor.
3. Execute the provided SQL schema.
4. Create a Storage Bucket.
5. Upload project assets.
6. Configure the environment variables.

---


# 🚀 Future Enhancements

- 🍽 AR Food Preview
- 🎙 Voice Ordering
- 🌍 Multi-language Support
- 🤖 Personalized AI Recommendations
- 💳 Online Payment Gateway Integration
- 📱 Progressive Web App (PWA)
- 📈 Advanced Restaurant Analytics
- 🔔 Push Notifications
- 📊 AI-Based Demand Prediction

---

# 🏆 Hackathon Highlights

- 🤖 AI-Powered Restaurant Experience
- 🍽 Smart Digital Ordering System
- 🔐 Role-Based Authentication
- 📦 Real-Time Order Workflow
- 📱 Fully Responsive UI
- ☁️ Cloud Database with Supabase
- ⚡ FastAPI + Next.js Architecture
- 🎯 Scalable & Production-Ready Design

---

# ❤️ Acknowledgements

Developed as part of **VibeAthon 6.0 (VibeCoding Hackathon)** organized by **NxtGenSec**.

Special thanks to the organizers, mentors, judges, and everyone who supported and inspired this project throughout the hackathon.

---
⭐ If you like this project, don't forget to give it a star on GitHub!
