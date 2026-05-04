#  Drivora — Cloud File Storage System

Drivora is a full-stack file management application inspired by Google Drive. It allows users to securely upload, organize, preview, and manage files inside folders with a scalable cloud-based architecture.

## LIVE LINK :https://drivora-2als.onrender.com/

##  Features

### Authentication

- User signup & login (Passport.js)
- Secure password hashing using bcrypt
- Session-based authentication

### Folder Management

- Create, update, delete folders
- Folder-wise file organization
- Cascading deletion (delete folder → deletes all files)

### File Management

- Upload files (images + PDFs supported)
- Download files via secure URLs
- Delete files (removes from both DB & cloud storage)
- File metadata storage (name, size, URL, public_id)

### Cloud Storage

- Migrated from local filesystem → Cloudinary
- Uses upload_stream for efficient uploads
- Stores public_id for precise file deletion
- CDN-backed file delivery for fast access

### UI/UX

- Clean, responsive UI using EJS
- Folder-based file browsing
- Immediate UI update after upload

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL (via Prisma ORM)
- Authentication: Passport.js
- File Upload: Multer (memory storage)
- Cloud Storage: Cloudinary
- Deployment: Render
- Templating: EJS

---

## Project Structure

Drivora/
│── controller/
│ ├── fileController.js
│ ├── folderController.js
│── db/
│ ├── query.js
│── prisma/
│ ├── schema.prisma
│── routes/
│── views/
│── app.js
│── package.json

---

## ⚙️ Environment Variables

Create a .env file:

DATABASE_URL=your_postgres_db_url
SESSION_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

---

## 🚀 Setup & Installation

1. Clone the repo
   git clone https://github.com/Harshkr1/Drivora.git
   cd Drivora

2. Install dependencies
   npm install

3. Generate Prisma client
   npx prisma generate

4. Run migrations
   npx prisma migrate dev

5. Start server
   npm start

---

## 🌍 Deployment (Render)

Build Command:
npm install && npx prisma generate && npx prisma migrate deploy

Start Command:
node app.js

---

## Key Improvements

- Migrated file storage from local disk → Cloudinary
- Replaced multer.diskStorage with memoryStorage
- Implemented streaming uploads (upload_stream)
- Added public_id tracking for efficient deletion
- Enabled folder-level cloud cleanup using prefix deletion
- Improved UX with instant folder rendering after upload

---

## Learnings

- Handling file uploads in production vs local environments
- Managing cloud storage lifecycle (upload, delete, sync with DB)
- Avoiding common pitfalls with multer & multipart requests
- Prisma migrations workflow (dev vs deploy)
- Full-stack system design for scalable file storage

---

## Author

Harsh Kumar  
GitHub: https://github.com/Harshkr1

---

## Final Note

This project demonstrates:

- Real-world backend architecture
- Cloud integration
- Scalable file handling system
