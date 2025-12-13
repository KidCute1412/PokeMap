# Comment System Documentation

## Tổng quan

Hệ thống comment cho phép người dùng bình luận trên các bài post với tính năng:

- Comment và Reply (trả lời comment)
- Real-time updates qua Socket.io
- Upload ảnh trong comment
- Like/Unlike comment (mỗi user chỉ like 1 lần)

---

## Backend

### 1. Model - `server/models/comment.model.js`

```javascript
{
    post: ObjectId (ref: 'Posts'),          // Bài post
    user: ObjectId (ref: 'Users'),          // Người comment
    content: String,                         // Nội dung
    images: [String],                        // Mảng URL ảnh
    parentComment: ObjectId (ref: 'Comments'), // Comment cha (null nếu là comment gốc)
    likedBy: [ObjectId (ref: 'Users')],     // Mảng user đã like
    isDeleted: Boolean,                      // Soft delete
    createdAt: Date,
    lastEditedAt: Date
}
```

**Indexes:**

- `{ post: 1, createdAt: -1 }` - Query comments theo post
- `{ parentComment: 1 }` - Query replies
- `{ user: 1 }` - Query theo user

---

### 2. Service - `server/services/comment.service.js`

| Function                                                              | Mô tả                                        |
| --------------------------------------------------------------------- | -------------------------------------------- |
| `createComment({ postId, userId, content, images, parentCommentId })` | Tạo comment mới hoặc reply                   |
| `getPostComments({ postId, page, limit })`                            | Lấy comments của post (kèm replies)          |
| `getCommentReplies({ commentId, page, limit })`                       | Lấy replies của một comment                  |
| `updateComment({ commentId, userId, content, images })`               | Cập nhật comment                             |
| `deleteComment({ commentId, userId })`                                | Xóa comment (soft delete)                    |
| `toggleLikeComment({ commentId, userId })`                            | Toggle like/unlike - mỗi user chỉ like 1 lần |
| `getCommentById({ commentId })`                                       | Lấy chi tiết comment                         |

---

### 3. Controller - `server/controllers/client/post.controller.js`

| Endpoint                           | Method | Auth | Mô tả                           |
| ---------------------------------- | ------ | ---- | ------------------------------- |
| `/:postId/comment`                 | POST   | ✅   | Tạo comment (hỗ trợ upload ảnh) |
| `/:postId/comments`                | GET    | ❌   | Lấy danh sách comments          |
| `/comments/:commentId/replies`     | GET    | ❌   | Lấy replies                     |
| `/comments/:commentId`             | PUT    | ✅   | Cập nhật comment                |
| `/comments/:commentId`             | DELETE | ✅   | Xóa comment                     |
| `/comments/:commentId/toggle-like` | POST   | ✅   | Toggle like comment             |

---

### 4. Routes - `server/routes/client/post.route.js`

```javascript
route.post(
  "/:postId/comment",
  verifyToken,
  upload.array("images", 5),
  postController.commentOnPost
);
route.get("/:postId/comments", postController.getPostComments);
route.get("/comments/:commentId/replies", postController.getCommentReplies);
route.put(
  "/comments/:commentId",
  verifyToken,
  upload.array("images", 5),
  postController.updateComment
);
route.delete("/comments/:commentId", verifyToken, postController.deleteComment);
route.post(
  "/comments/:commentId/toggle-like",
  verifyToken,
  postController.toggleLikeComment
);
```

---

### 5. Upload Route - `server/routes/client/upload.route.js`

```javascript
route.post(
  "/upload-comment-images",
  verifyToken,
  upload.array("images", 5),
  uploadController
);
```

Đăng ký trong `server/routes/client/index.route.js`:

```javascript
route.use("/upload", uploadRouter);
```

---

### 6. Socket.io - `server/services/socket.service.js`

#### Events từ Client:

| Event                 | Data                                                   | Mô tả              |
| --------------------- | ------------------------------------------------------ | ------------------ |
| `join_post`           | `postId`                                               | Join room của post |
| `leave_post`          | `postId`                                               | Leave room         |
| `new_comment`         | `{ postId, userId, content, images, parentCommentId }` | Tạo comment mới    |
| `update_comment`      | `{ commentId, userId, content, images, postId }`       | Cập nhật comment   |
| `delete_comment`      | `{ commentId, userId, postId }`                        | Xóa comment        |
| `toggle_like_comment` | `{ commentId, postId, userId }`                        | Toggle like        |

#### Events từ Server (broadcast to room):

| Event                  | Data                                                 | Mô tả                 |
| ---------------------- | ---------------------------------------------------- | --------------------- |
| `comment_added`        | `{ success, data, isReply }`                         | Comment mới được tạo  |
| `comment_updated`      | `{ success, data }`                                  | Comment được cập nhật |
| `comment_deleted`      | `{ success, commentId }`                             | Comment bị xóa        |
| `comment_like_toggled` | `{ success, commentId, likedBy, likesCount, liked }` | Like/unlike           |
| `comment_error`        | `{ success: false, message }`                        | Lỗi                   |

---

## Frontend

### 1. Socket Hook - `client/src/hooks/useSocket.jsx`

```javascript
import { useSocket } from "../hooks/useSocket";

const { socket, isConnected } = useSocket();
```

- Kết nối tới `VITE_API_URL` (http://localhost:10000)
- Auto reconnect
- Return `socket` instance và trạng thái `isConnected`

---

### 2. Component - `client/src/components/CommentSection.jsx`

**Props:**

- `postId` - ID của bài post
- `currentUserId` - ID của user đang đăng nhập

**Tính năng:**

- Hiển thị danh sách comments với replies
- Form input để viết comment/reply
- Upload tối đa 5 ảnh
- Like/Unlike với icon ❤️/🤍
- Xóa comment của mình
- Real-time updates qua Socket.io
- Scrollable với dark theme

**State Management:**

```javascript
const [comments, setComments] = useState([]); // Danh sách comments
const [newComment, setNewComment] = useState(""); // Nội dung đang nhập
const [replyingTo, setReplyingTo] = useState(null); // ID comment đang reply
const [selectedImages, setSelectedImages] = useState([]); // Files đã chọn
const [previewImages, setPreviewImages] = useState([]); // Preview URLs
```

**Socket Listeners:**

- `comment_added` - Thêm comment mới (phân biệt reply và comment gốc)
- `comment_updated` - Cập nhật comment (cả trong replies)
- `comment_deleted` - Xóa comment (cả trong replies)
- `comment_like_toggled` - Cập nhật likedBy array

---

### 3. Styling - `client/src/components/CommentSection.css`

- Dark theme phù hợp modal
- Scrollable comments list với custom scrollbar
- Form cố định ở dưới
- Max height `calc(90vh - 150px)`
- Responsive cho mobile
- Trạng thái `.liked` cho nút like

---

## Cách sử dụng

### Import Component:

```jsx
import CommentSection from "../components/CommentSection";
import { useAuth } from "../routes/ProtectedRouter";

function PostDetail({ postId }) {
  const { user } = useAuth();

  return <CommentSection postId={postId} currentUserId={user?._id} />;
}
```

### Cấu trúc dữ liệu Comment:

```javascript
{
    _id: "...",
    content: "Nội dung comment",
    images: ["url1", "url2"],
    likedBy: ["userId1", "userId2"],
    createdAt: "2025-12-13T...",
    parentComment: null, // hoặc "parentCommentId" nếu là reply
    userInfo: {
        _id: "...",
        username: "user123",
        profile: {
            avatar: "url"
        }
    },
    replies: [
        // Mảng các reply với cấu trúc tương tự
    ]
}
```

---

## Luồng hoạt động

### 1. Load Comments:

```
Component mount → GET /api/post/:postId/comments → setComments()
```

### 2. Tạo Comment:

```
User submit → Upload images → socket.emit('new_comment')
→ Server xử lý → io.to(room).emit('comment_added')
→ All clients nhận và cập nhật UI
```

### 3. Reply Comment:

```
Click "Trả lời" → setReplyingTo(commentId) → Submit với parentCommentId
→ Server tạo comment với parentComment
→ Clients nhận và thêm vào replies array của parent
```

### 4. Like Comment:

```
Click like → socket.emit('toggle_like_comment', { commentId, userId })
→ Server toggle userId trong likedBy array
→ Broadcast 'comment_like_toggled' với likedBy mới
→ UI cập nhật icon và số like
```

---

## Cấu hình Server cần thiết

### server/index.js

```javascript
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./services/socket.service.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3800"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

// QUAN TRỌNG: Dùng server.listen() thay vì app.listen()
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Environment Variables

### Client (.env)

```
VITE_API_URL=http://localhost:10000
```

### Server (.env)

```
PORT=10000
MONGODB_URI=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
