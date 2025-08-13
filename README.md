Follow these steps to get the project up and running on your local machine.

1. Clone the Repository
   git clone https://github.com/dhananjay-gupta3/employees.git
cd [Your-Repo-Name]

2. Backend Setup
Navigate to the backend folder, install dependencies, and set up your environment variables.
cd backend
npm install
Create a .env file in the backend directory and add the following variables:
MONGO_URI=your_mongodb_connection_string

3. Frontend Setup
Navigate to the frontend folder and install dependencies.
cd ../frontend
npm install

 Start the Backend Server
From the backend directory, run the following command:
cd backend
node server.js
The server will be running on http://localhost:5000.

 Start the Frontend Development Server
From the frontend directory, run the following command:
cd ../frontend
npm run dev
The application will open in your browser at http://localhost:5173.

