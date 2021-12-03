import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

// const router = express.Router();

export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    res.status(200).json(postMessage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getPost = async (req, res) => {
  const { id: _id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id ${_id}`);
  try {
    const post = PostMessage.findById(_id);
    res.status(201).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

}

export const createPost = async (req, res) => {
  const post = req.body; // post = { title, message, selectedFile, name, tags }

  const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
  
  // dùng try để bắt lỗi từ database
  try {
    await newPostMessage.save();

    // https://www.restapitutorial.com/httpstatuscoders.html
    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params; // destructuring id property and rename it as undercore id
  const post = req.body; // post = { title, message, creator, selectedFile, tags } 
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id ${_id}`);

  const updatePost = await PostMessage.findByIdAndUpdate(_id, {...post, _id: _id}, { new: true}); // cuz it's a asynchorous action we have to put async and await
  // spread all property that we're receiving from the front-end and pass it the _id too
  // cuz schema also contain that value to work well with findByIdAndUpdate command
  await console.log({id: updatePost._id, title: updatePost.title, creator: updatePost.creator });
  res.json(updatePost);
}

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id ${_id}`);

  await PostMessage.findByIdAndRemove(_id);

  res.json({ message: 'Post deleted successfully' });
}

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  // check if  user authenticated or not
  if (!req.userId) return res.status(401).json({ message: "Don't have permission !"});

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id ${_id}`);

  const post = await PostMessage.findById(_id);

  // likes lưu trữ các user like bài post này
  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    // không có thì tăng thêm người vào danh sách like của bài post đó
    post.likes.push(req.userId);
  } else {
    // nếu user trigger lại hành động like thì sẽ unlike 
    // ==> xóa user đó khỏi danh sách like của bài post đó
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatePost = await PostMessage.findByIdAndUpdate(_id, post , { new: true});
  
  res.json(updatePost);
}