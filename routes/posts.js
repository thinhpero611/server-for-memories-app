import express from 'express';

// controllers
import { getPosts, createPost, updatePost, deletePost, likePost, getPost } from '../controllers/posts.js';

// middleware
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', authenticateToken, createPost);
router.get('/:id',authenticateToken, getPost); 
router.patch('/:id', authenticateToken, updatePost);// người dùng chỉ có thể update những bài post mà họ tạo ra
 // patch for updating exsiting document
router.delete('/:id', authenticateToken, deletePost);
// chỉ xóa bài post mà họ tạo ra
// ở front end nếu người dùng không phải creator của bài post đó thì phải không có nút xóa ở user của mình

router.patch('/:id/likePost', authenticateToken, likePost);
// chỉ được like bài post một lần

export default router;

