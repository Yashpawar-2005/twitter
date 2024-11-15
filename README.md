"# twitter" 

Post Posting Website (MERN Stack)
Overview
This is a Post Posting Website built using the MERN stack (MongoDB, Express, React, Node.js). Users can create, edit, and view posts, and upload images using Cloudinary for media storage.

Frontend: React with Vite
Backend: Node.js and Express
Database: MongoDB
Cloud Storage: Cloudinary for image uploads


Create a .env file in the root of your project directory and in both the frontend and backend directories. Here’s an example for the backend .env file:

env
Copy code
VITE_PORT=5000
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/test
DB_NAME=post_website_db



Setup Instructions
1. Clone the Repository
bash
Copy code
git clone <repository-url>
cd <project-folder>
2. Install Dependencies
Backend (Node.js + Express)
Navigate to the backend directory and install the required dependencies:

bash
Copy code
cd backend
npm install
Frontend (React + Vite)
Navigate to the frontend directory and install the required dependencies:

bash
Copy code
cd frontend
npm install
3. Configure Environment Variables
Frontend: Create a .env file in the frontend directory.

Example for frontend/.env:

env
Copy code
VITE_PORT=5000
Backend: Create a .env file in the backend directory with the Cloudinary and MongoDB settings as described earlier.

Example for backend/.env:

env
Copy code
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/test
DB_NAME=post_website_db
4. Run the Backend Server
Start the backend server by running the following command inside the backend folder:

bash
Copy code
npm run dev
This will run your backend server, typically on http://localhost:4000.

5. Run the Frontend Server
Start the frontend server by running the following command inside the frontend folder:

bash
Copy code
npm run dev
This will run your Vite-powered React app
