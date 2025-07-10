Cyber Advanced App
A full-stack web application for secure user registration, login, password reset, and email verification, built with Node.js, Express, MySQL, and React.

🚀 Features
User registration with email verification

Secure authentication (JWT)

Password reset via email

MySQL database integration

Environment variable configuration

Nodemailer for email delivery (Gmail App Password required)

Error handling and helpful backend logs

🏗️ Project Structure
text
cyber-advanced-app/
├── backend/
│   ├── index.js
│   ├── db.js
│   ├── mailer.js
│   ├── routes/
│   └── .env
└── frontend/
    ├── src/
    ├── public/
    └── package.json
⚙️ Setup Instructions
1. Clone the Repository
bash
git clone https://github.com/yourusername/cyber-advanced-app.git
cd cyber-advanced-app
2. Backend Setup
bash
cd backend
npm install
Configure .env:
text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=cyber_advanced
JWT_SECRET=supersecretkey
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_USER: Your Gmail address

EMAIL_PASS: 16-character Gmail App Password (not your normal password)

Create Database
Login to MySQL and run:

sql
CREATE DATABASE cyber_advanced;
3. Frontend Setup
bash
cd ../frontend
npm install
🏃‍♂️ Running the App
Start Backend
bash
cd backend
node index.js
Should see: Server running on http://localhost:5000 and Connected to MySQL

Start Frontend
bash
cd ../frontend
npm start
Opens at http://localhost:3000 (or another port if 3000 is busy)

💡 Usage
Register a new user in the frontend.

Check your email for verification (check spam/junk if not found).

Login after verifying your email.

Forgot Password: Use the "Forgot Password" link to reset via email.

🛠️ Troubleshooting
Issue	Solution
Email not received	Use Gmail App Password, check spam, restart backend
"User exists" on registration	Use a new username/email or delete the user from the database
"Cannot GET /"	This is normal for REST APIs; use frontend for registration/login
MySQL connection error	Check .env DB settings, ensure MySQL is running, database exists
SSL/TLS warning	NODE_TLS_REJECT_UNAUTHORIZED=0 is safe for development only
🔒 Security Notes
Never commit your .env file or app password to public repositories.

Use NODE_TLS_REJECT_UNAUTHORIZED=0 only in development, not in production.

For production, consider OAuth2 for Gmail or a transactional email service.

🙋 FAQ
Q: Why do I need a Gmail App Password?
A: Google blocks normal password logins for apps. Use a 16-character App Password from your Google Account Security settings.

Q: Why do I see "User exists"?
A: The username or email is already in the database. Use a new one or delete the existing user.

📄 License
MIT License

✨ Contributions
Pull requests and issues welcome! Please open an issue for bugs or feature requests.

Happy coding! 🚀
