# 🏦 Bank Transaction System

A secure backend REST API for a banking system built with Node.js, Express, and MongoDB.

## 🚀 Live Demo
> Base URL: `https://your-app.onrender.com`

---

## 📌 Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ JWT Token with Blacklist (Secure Logout)
- ✅ Role Based Access Control (User, Admin, System)
- ✅ Bank Account Management
- ✅ Fund Deposit (System → User)
- ✅ Money Transfer (User → User)
- ✅ Ledger System (Balance Tracking)
- ✅ Idempotency Key (Duplicate Transaction Prevention)
- ✅ MongoDB Sessions (Atomic Transactions)
- ✅ Email Notifications (Mailtrap/Gmail)
- ✅ Seed File (Auto System Account Setup)

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Nodemailer | Email Service |
| Dotenv | Environment Variables |

---

## 📁 Project Structure

src/
├── controllers/
│   ├── auth.controller.js
│   ├── account.controller.js
│   └── transaction.controller.js
├── middlewares/
│   └── auth.middleware.js
├── model/
│   ├── user.model.js
│   ├── account.model.js
│   ├── transaction.model.js
│   ├── ledger.model.js
│   └── blackList.model.js
├── routes/
│   ├── auth.routes.js
│   ├── account.routes.js
│   └── transaction.routes.js
├── services/
│   └── email.service.js
├── seed/
│   └── system.seed.js
server.js   --out-side src folder
---

## ⚙️ Environment Variables

Create a `.env` file in root directory:

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Mailtrap (Development)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass

# Gmail OAuth2 (Production)
EMAIL_USER=your_gmail
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Puneet1202/Bank-Transaction-project.git

# Install dependencies
npm install

# Setup system account
node src/seed/system.seed.js

# Start server
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### 🏦 Account
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/account/create` | Create bank account |
| GET | `/api/account/get` | Get user account |
| GET | `/api/account/balance` | Get account balance |

### 💸 Transaction
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transaction/transfer` | Transfer money (User → User) |
| POST | `/api/transaction/system/initial-fund` | Deposit funds (System → User) |

---

## 🔒 Security Features

### JWT Blacklist
Token blacklist on logout — prevents token reuse after logout.

### Immutable Transactions
Transaction records cannot be modified or deleted after creation.

### Session Based Transactions
MongoDB sessions ensure atomic transactions — either all steps complete or none.

### Idempotency Key
Prevents duplicate transactions from being processed.

---

## 💡 How Transactions Work

```
Deposit (System → User):
1. Validate request
2. Find system account
3. Find user account
4. Start MongoDB session
5. Create transaction record
6. Create debit ledger (system)
7. Create credit ledger (user)
8. Update status to completed
9. Commit session

Transfer (User → User):
1. Validate request
2. Validate accounts
3. Check balance
4. Start MongoDB session
5. Create transaction record
6. Create debit ledger (sender)
7. Create credit ledger (receiver)
8. Update status to completed
9. Commit session
```

---

## 📧 Email Notifications

- Welcome email on registration
- Login notification
- Transaction alerts

---

## 👤 Author

**Puneet Kumar**
- GitHub: [@Puneet1202](https://github.com/Puneet1202)

---

## 📄 License

MIT License