# Admin API Documentation

Base URL: `http://localhost:PORT/api/admin`

---

## 🔐 Authentication Routes (`/admin/auth`)

### 1. Admin Signup

**POST** `/admin/auth/signup`

Create a new admin account.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "securePassword123",
  "username": "admin_username"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to complete admin signup.",
  "data": {
    "email": "admin@example.com"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Email already registered as admin"
}
```

---

### 2. Verify Admin Signup OTP

**POST** `/admin/auth/verify-otp-signup`

Verify OTP sent during signup to complete registration.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Admin account created successfully!",
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "username": "admin_username",
      "role": "admin"
    }
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts remaining."
}
```

---

### 3. Resend Admin Signup OTP

**POST** `/admin/auth/resend-otp-signup`

Request a new OTP if the previous one expired.

**Request Body:**

```json
{
  "email": "admin@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "New OTP sent to your email"
}
```

---

### 4. Admin Login

**POST** `/admin/auth/login`

Authenticate admin credentials and receive a JWT token.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "username": "admin_username",
      "role": "admin",
      "profile": {}
    }
  }
}
```

**Note:** JWT token is set as HTTP-only cookie

---

### 5. Forgot Admin Password

**POST** `/admin/auth/forgot-password`

Request OTP for password reset.

**Request Body:**

```json
{
  "email": "admin@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

---

### 6. Verify Admin Forgot Password OTP

**POST** `/admin/auth/verify-otp-forgot-password`

Verify OTP for password reset.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "OTP verified. You can now reset your password."
}
```

---

### 7. Reset Admin Password

**POST** `/admin/auth/reset-password`

Reset password after OTP verification.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "newPassword": "newSecurePassword123"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Admin password reset successful"
}
```

---

## 👥 User Management Routes (`/admin/user`)

### 1. Get All Users

**GET** `/admin/user/listUsers`

Retrieve a paginated list of all users.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (Success):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "sex": "male",
      "profile": {
        "avatar": "url"
      },
      "emailVerified": true,
      "role": "user",
      "createdAt": "2025-12-05T10:00:00Z"
    }
  ]
}
```

---

### 2. Get User Details

**GET** `/admin/user/detailUser/:id`

Retrieve details of a specific user.

**URL Parameters:**

- `id` (required): User ID

**Response (Success):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "sex": "male",
    "profile": {
      "avatar": "url"
    },
    "emailVerified": true,
    "role": "user",
    "createdAt": "2025-12-05T10:00:00Z"
  }
}
```

---

### 3. Delete User

**DELETE** `/admin/user/deleteUser/:id`

Permanently delete a user account.

**URL Parameters:**

- `id` (required): User ID

**Response (Success):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 4. Get Total User Pages

**GET** `/admin/user/total-pages`

Get the total number of pages for user pagination.

**Query Parameters:**

- `limit` (optional): Items per page (default: 10)

**Response (Success):**

```json
{
  "success": true,
  "message": "Total pages retrieved successfully",
  "data": {
    "totalPages": 5
  }
}
```

---

## 📝 Post Management Routes (`/admin/post`)

### 1. Get All Posts

**GET** `/admin/post/listPosts`

Retrieve a paginated list of all posts.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (Success):**

```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "_id": "post_id",
      "user": "user_id",
      "content": "Post content",
      "images": ["image_url"],
      "isDeleted": false,
      "isWarned": false,
      "createdAt": "2025-12-05T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Post Details

**GET** `/admin/post/detail/:postId`

Retrieve details of a specific post.

**URL Parameters:**

- `postId` (required): Post ID

**Response (Success):**

```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "_id": "post_id",
    "user": "user_id",
    "content": "Post content",
    "images": ["image_url"],
    "isDeleted": false,
    "isWarned": false,
    "createdAt": "2025-12-05T10:00:00Z"
  }
}
```

---

### 3. Get Total Post Pages

**GET** `/admin/post/total-pages`

Get the total number of pages for post pagination.

**Query Parameters:**

- `limit` (optional): Items per page (default: 10)

**Response (Success):**

```json
{
  "success": true,
  "message": "Total pages retrieved successfully",
  "data": {
    "totalPages": 10
  }
}
```

---

### 4. Warn Post

**PATCH** `/admin/post/warn/:postId`

Issue a warning to a post. After 3 warnings, the post is automatically deleted.

**URL Parameters:**

- `postId` (required): Post ID

**Request Body:**

```json
{
  "warningType": "inappropriate",
  "description": "Nội dung vi phạm tiêu chuẩn cộng đồng",
  "warnedBy": "admin_user_id"
}
```

**Warning Types:**

- `inappropriate`: Nội dung không phù hợp
- `spam`: Thư rác
- `misleading`: Thông tin sai lệch
- `violent`: Nội dung bạo lực
- `other`: Khác

**Response (Success - Warning 1 or 2):**

```json
{
  "success": true,
  "message": "Post warned successfully. Warning count: 1/3",
  "data": {
    "post": {
      "_id": "post_id",
      "content": "Post content",
      "isWarned": true,
      "isDeleted": false
    },
    "warning": {
      "_id": "warning_id",
      "post": "post_id",
      "warningType": "inappropriate",
      "warningCount": 1,
      "warnedBy": "admin_user_id",
      "warnedAt": "2025-12-05T10:00:00Z"
    }
  }
}
```

**Response (Success - Warning 3):**

```json
{
  "success": true,
  "message": "Post has been warned 3 times and deleted",
  "data": {
    "post": {
      "_id": "post_id",
      "content": "Post content",
      "isWarned": true,
      "isDeleted": true,
      "deletedAt": "2025-12-05T10:00:00Z"
    },
    "warning": {
      "_id": "warning_id",
      "post": "post_id",
      "warningType": "inappropriate",
      "warningCount": 3,
      "warnedBy": "admin_user_id",
      "isResolved": true,
      "resolvedAt": "2025-12-05T10:00:00Z"
    }
  }
}
```

---

### 5. Delete Post

**PATCH** `/admin/post/delete/:postId`

Directly delete a post (without warning system).

**URL Parameters:**

- `postId` (required): Post ID

**Request Body:**

```json
{
  "reason": "inappropriate",
  "description": "Description of deletion reason",
  "deletedBy": "admin_user_id"
}
```

**Deletion Reasons:**

- `spam`: Thư rác
- `harassment`: Qu 騷 rồ
- `inappropriate`: Không phù hợp
- `copyright`: Vi phạm bản quyền
- `other`: Khác

**Response (Success):**

```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "post": {
      "_id": "post_id",
      "isDeleted": true,
      "deletedAt": "2025-12-05T10:00:00Z"
    },
    "deleteReason": {
      "_id": "reason_id",
      "post": "post_id",
      "reason": "inappropriate",
      "description": "Description",
      "deletedBy": "admin_user_id",
      "deletedAt": "2025-12-05T10:00:00Z"
    }
  }
}
```

---

## ❌ Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

---

## 🔒 Authentication

Most admin routes require authentication via JWT token in HTTP-only cookies. After login, include the token cookie in subsequent requests.

---

## 📋 Notes

- All timestamps are in ISO 8601 format
- Pagination defaults: page=1, limit=10
- Post warnings are cumulative and tracked in the `PostWarning` model
- Deleted posts are marked with `isDeleted=true` and `deletedAt` timestamp
- Admin actions are logged by `deletedBy` or `warnedBy` fields for audit trails
