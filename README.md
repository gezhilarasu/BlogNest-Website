# 📝 BlogNest

**BlogNest** is a dynamic, full-stack blog publishing platform where users can create, explore, like, comment, and favorite blog posts. Designed with a sleek UI and responsive layout, BlogNest provides an engaging reading and writing experience for everyone.

Whether you're a content creator or a curious reader, BlogNest allows you to express your ideas, connect with other users, and keep track of your favorite reads — all in one place.

---

## 🌟 Key Features

### 🧑‍💻 Authentication & Authorization
- Secure user login and registration using **JWT tokens**
- Routes protected using middleware based on user session tokens

### 📝 Post Management
- Create and delete posts
- Upload and display images (buffer)
- Categorize posts by topics like **Technology**, **Travel**, **Food**, etc.

### 📚 Browse & Filter
- View all posts on the homepage
- Filter posts by category
- Responsive blog grid with dynamic image rendering

### ❤️ Interactions
- Like/unlike posts with toggle
- Add/remove favorites
- View real-time view counts
- Add comments and reply to other users (nested replies supported)

### 🎨 UI/UX
- Fully responsive layout for desktop and mobile
- Gradient UI design with custom animations
- Avatar initials displayed in navbar
- Logout dropdown with adaptive positioning (responsive behavior)

---

## 🚀 Tech Stack

| Frontend | Backend |
|----------|---------|
| React (Vite) | Node.js (Express) |
| React Router DOM | MongoDB with Mongoose |
| Custom CSS | Multer (Image Uploads) |
| Fetch API | JWT for authentication |
| Responsive Design | CORS, dotenv, etc. |

---

## 🛠️ Setup & Installation

### ⚙️ Prerequisites
- Node.js and npm
- MongoDB (local or MongoDB Atlas)

### 🔧 Backend Setup

```bash
cd server
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm run dev
🌐 Frontend Setup
bash
Copy
Edit
cd client
npm install
npm run dev
Now visit: http://localhost:5173 to open the BlogNest site.

🌐 Deployment
Frontend: Vercel 

Backend: Render 

Database: MongoDB Atlas

## ✨ Roadmap / Future Improvements

- 🔍 Add search functionality
- 🌙 Dark mode toggle
- 🧠 Post recommendations by category
- 📧 Email notifications for replies
- 📊 Admin dashboard for analytics

---

## 👤 Author

**Ezhilarasu G**  
- GitHub: [@gezhilarasu](https://github.com/gezhilarasu)  
- LinkedIn: *[Add your LinkedIn profile link here]*

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel](https://vercel.com/)
- [JWT.io](https://jwt.io/)

