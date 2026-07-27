# 🍽️ VibeBite: Smart Restaurant Management System

> **Submission for HackVibe Hackathon** 🚀

<!-- [LEAVE SPACE HERE: Add your HackVibe Hackathon description, project journey, or problem statement overview here] -->

---

## 👥 Team Details

* **Team Name:** Sukanya
* **Team Lead:** Sukanya
* **Team Members:** 
  * Smridhi Kaur
  * Balpreet Kaur

---

## 🌟 About the Project

**VibeBite** is a next-generation, AI-powered Smart Restaurant Management System built from the ground up to revolutionize the dining and restaurant operations experience. Designed with meticulous detail, high-performance architecture, and a gorgeous user interface, VibeBite bridges the gap between hungry customers and seamless kitchen/waitstaff execution. 

---

## ✨ Unique Features

* **Dual-Portal Architecture:** 
  * **Customer Portal:** An intuitive, lightning-fast web interface for customers to browse the menu, manage carts, call specific waitstaff, and interact with the AI assistant seamlessly.
  * **Admin Portal:** A robust command center designed to oversee all restaurant operations.
* **Role-Based Secure Dashboards:** 
  * Divided into dedicated, password-protected dashboards for **Managers**, **Kitchen Staff**, and **Waiters**. 
  * Strict authentication barriers ensure that sensitive administrative and kitchen controls are strictly secure.
* **Restaurant-Specific AI Assistant:** 
  * Powered by state-of-the-art LLMs, the integrated AI assistant is fine-tuned specifically for restaurant operations, guiding customers through menu choices, dietary preferences, and real-time recommendations.
* **Real-time Order & Service Tracking:** Instant notifications between tables, kitchen inventory, and waiters to drastically cut down wait times and eliminate human error.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, Tailwind CSS, TypeScript, Lucide Icons
* **Backend:** FastAPI, Python, Uvicorn
* **Database & Storage:** Supabase (PostgreSQL & Cloud Storage)

---

## 🚀 Getting Started & Installation Guide

Follow these steps to set up and run the project locally on your machine.

### Prerequisites
* Python (v3.9 or higher installed)
* Node.js & npm (v18 or higher installed)
* A Supabase Account

---

### Step 1: Clone the Repository
git clone [https://github.com/Sukanya-29/Smart-Restaurant-Management-System.git](https://github.com/Sukanya-29/Smart-Restaurant-Management-System.git)
cd Smart-Restaurant-Management-System

### Step 2: Database & Storage Setup (Supabase)

1. Create a new project on Supabase.

2. Navigate to the SQL Editor in your Supabase dashboard, open your project's supabase.sql file, copy its code, paste it directly into the Supabase SQL editor, and run it to set up all necessary tables and database relations.

3. Go to the Storage section in Supabase, create a storage bucket, and upload all the asset images from the project's public folder onto the Supabase cloud so they load seamlessly across the application.

4. Keep your Supabase API keys and project URL ready.

### Step 3: Running the Project (Using Two Split Terminals)
To run VibeBite successfully, you will need to open two separate terminal windows/splits—one for the backend server and one for the frontend client.

### 🖥️ Terminal 1: Backend Setup & Execution
Navigate to the backend directory:

cd app
(Recommended) Create and activate a Python virtual environment to manage dependencies cleanly:

python -m venv venv
### On Windows:
venv\Scripts\activate
### On macOS/Linux:
source venv/bin/activate
<br>
1. Install all required dependencies based on the requirements list:
pip install -r requirements.txt
<br>
2. Start the FastAPI backend server:
uvicorn main:app --reload

### 🌐 Terminal 2: Frontend Setup & Execution
1. Open a second split terminal and navigate to the frontend directory:
cd frontend
<br>
2. Install the required Node packages:
npm install
<br>
3. Run the Next.js development server:
npm run dev
<br>
