import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const safeRole = role === 'HOST' ? 'HOST' : 'USER';
    const user = await User.create({ name, email, password, role: safeRole });
    res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function updateAvatar(req, res, next) {
  try {
    const match = typeof req.body?.avatar === 'string'
      ? /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(req.body.avatar)
      : null;
    if (!match) return res.status(400).json({ message: 'Choose a valid image to upload' });

    const image = Buffer.from(match[1], 'base64');
    if (
      image.length > 256 * 1024 ||
      image.toString('base64') !== match[1] ||
      image[0] !== 0xff ||
      image[1] !== 0xd8
    ) {
      return res.status(400).json({ message: 'The image must be a JPEG smaller than 256 KB' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Account not found' });
    user.avatar = req.body.avatar;
    await user.save();

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    next(error);
  }
}
