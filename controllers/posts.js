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
  const { title, message, selectedFile, creator, tags } = req.body;

  const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags });

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

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id ${_id}`);

  const post = await PostMessage.findById(_id);

  const updatePost = await PostMessage.findByIdAndUpdate(_id, { likeCount: post.likeCount + 1}, { new: true});
  
  res.json(updatePost);
}