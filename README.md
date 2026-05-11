# 🚜 TraktorBNB

**Platform pentru închirierea echipamentelor agricole** | Airbnb pentru ferme

Platformă digitală care conectează proprietarii de echipamente agricole cu fermieri care au nevoie de ele, simplificând procesul de închiriere și gestionare.

---

## 📖 Overview

TraktorBNB este o platformă web fullstack care revolutionează modul în care fermerii accesează echipamentele agricole. Similar cu Airbnb, TraktorBNB permite proprietarilor să-și listeze echipamentele și fermierilor să le închirieze.

### Problemă rezolvată
- ❌ **Înainte:** Fermieri caută manual echipamente, contacturi dificile
- ✅ **Acum:** Platformă centralizată, booking online, evaluări transparente

---

## ✨ Features

### Pentru fermieri
- 🔍 Căutare avansată cu filtrare
- 📅 Booking ușor cu selectare date
- ⭐ Evaluări transparente
- 📱 Responsive design

### Pentru proprietari
- 📊 Dashboard complet
- 📈 Analytics și statistici
- 🔔 Notificări pentru noi rezervări
- 📸 Upload imagini cu Cloudinary

### General
- 🔐 Autentificare Firebase sigură
- ✅ Teste automate (toate passing)
- 🐳 Docker containerized
- ⚡ Performance optimizat

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS  
**Backend:** FastAPI, PostgreSQL  
**Auth:** Firebase Authentication  
**Storage:** Cloudinary  
**Infrastructure:** Docker & Docker Compose

---

## 📸 Screenshots

### 🏠 Homepage
![Homepage](./screenshots/homepage.png)

### 🔍 Equipment Listing
![Listing](./screenshots/listing.png)

### 📅 Booking Flow
![Booking](./screenshots/booking.png)

### 📊 Owner Dashboard
![Dashboard](./screenshots/dashboard.png)

---

## 🚀 Quick Start

### Cu Docker (Recomand)

```bash
# Clone repository
git clone https://github.com/doruchitu/TraktorBNB.git
cd TraktorBNB

# Start services
docker-compose up

# Accesează:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual (fără Docker)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🔌 API Documentation

### Interactive Docs
