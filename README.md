# 🌍 Wanderlust

A full-stack travel and stay booking web application inspired by Airbnb.  
Users can create, explore, and review listings with images stored on **Cloudinary**.

## 📌 About the Project

**Wanderlust** is a platform where users can:  
- Create and manage listings (CRUD).  
- Upload and store images via Cloudinary.  
- Browse other listings.  
- Post reviews and ratings.  

---

## ✨ Features

- 🔐 User Authentication (Login/Register)  
- 🏡 CRUD Listings (Create, Read, Update, Delete)  
- 📷 Image Uploads (via Cloudinary)  
- ⭐ Reviews & Ratings  
- 📱 Responsive Design (mobile-friendly)  

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, Bootstrap, JavaScript, EJS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** Passport.js / Session  
- **Cloud Services:** Cloudinary (image storage)  
- **Other Tools:** dotenv, nodemon  

---

## ⚙️ Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/wanderlust.git
   cd wanderlust

Install dependencies

npm install


Setup environment variables (see below)

Start the development server

npm start

🔑 Environment Variables

Create a .env file in the root directory with the following:

PORT=3000
MONGO_URI=your_mongodb_connection
SESSION_SECRET=your_secret_key

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

📂 Folder Structure
wanderlust/
│-- public/         # Static files (CSS, JS, images)
│-- routes/         # Express routes
│-- models/         # Mongoose models
│-- views/          # EJS templates
│-- controllers/    # Controller logic
│-- utils/          # Helper utilities
│-- app.js          # Main server entry
│-- package.json
│-- .env


🚀 Usage

Register or login as a user

Create new listings with images

Browse and view listings

Add reviews and ratings


🔮 Future Enhancements

💳 Payment Gateway Integration (Stripe/PayPal)

🗺️ Map Integration (Mapbox/Google Maps API)

📱 Mobile App (React Native / Flutter)

🧳 Booking Calendar


   
