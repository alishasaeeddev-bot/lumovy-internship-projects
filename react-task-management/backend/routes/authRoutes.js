const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      'Signup error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          'Email and password are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        message:
          'This account uses Google login. Please continue with Google.',
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(
      'Login error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Google Login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message:
          'Google credential is required',
      });
    }

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      email_verified,
    } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({
        message:
          'Google email could not be verified',
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        password: null,
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      message:
        'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(
      'Google login error:',
      error.message
    );

    res.status(401).json({
      message:
        'Google authentication failed',
    });
  }
});

// Get current logged-in user
router.get('/me', protect, async (req, res) => {
  try {
    const user =
      await User.findById(req.userId).select(
        '-password'
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error(
      'Get user error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Update profile
router.put(
  '/profile',
  protect,
  async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          message:
            'Name and email are required',
        });
      }

      const trimmedName = name.trim();
      const trimmedEmail =
        email.trim().toLowerCase();

      if (!trimmedName || !trimmedEmail) {
        return res.status(400).json({
          message:
            'Name and email are required',
        });
      }

      const existingUser =
        await User.findOne({
          email: trimmedEmail,
          _id: { $ne: req.userId },
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            'Email is already in use',
        });
      }

      const user = await User.findById(
        req.userId
      );

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      user.name = trimmedName;
      user.email = trimmedEmail;

      await user.save();

      res.json({
        message:
          'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        'Update profile error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// Upload or change profile image
router.put(
  '/profile/image',
  protect,
  upload.single('profileImage'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            'Profile image is required',
        });
      }

      const user = await User.findById(
        req.userId
      );

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const oldImageUrl = user.profileImage;

      user.profileImage = req.file.path;

      await user.save();

      if (oldImageUrl) {
        try {
          const imageParts =
            oldImageUrl.split('/');

          const uploadIndex =
            imageParts.findIndex(
              (part) => part === 'upload'
            );

          if (uploadIndex !== -1) {
            const publicIdWithExtension =
              imageParts
                .slice(uploadIndex + 2)
                .join('/');

            const lastDotIndex =
              publicIdWithExtension.lastIndexOf(
                '.'
              );

            const publicId =
              lastDotIndex !== -1
                ? publicIdWithExtension.substring(
                    0,
                    lastDotIndex
                  )
                : publicIdWithExtension;

            await cloudinary.uploader.destroy(
              publicId
            );
          }
        } catch (cloudinaryError) {
          console.error(
            'Old profile image delete error:',
            cloudinaryError.message
          );
        }
      }

      res.json({
        message:
          'Profile image updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        'Profile image upload error:',
        error.message
      );

      res.status(500).json({
        message:
          'Could not upload profile image',
      });
    }
  }
);

// Delete profile image
router.delete(
  '/profile/image',
  protect,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.userId
      );

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (!user.profileImage) {
        return res.status(400).json({
          message:
            'No profile image to delete',
        });
      }

      const imageUrl = user.profileImage;

      const imageParts = imageUrl.split('/');

      const uploadIndex =
        imageParts.findIndex(
          (part) => part === 'upload'
        );

      if (uploadIndex === -1) {
        return res.status(400).json({
          message:
            'Invalid profile image URL',
        });
      }

      const publicIdWithExtension =
        imageParts
          .slice(uploadIndex + 2)
          .join('/');

      const lastDotIndex =
        publicIdWithExtension.lastIndexOf(
          '.'
        );

      const publicId =
        lastDotIndex !== -1
          ? publicIdWithExtension.substring(
              0,
              lastDotIndex
            )
          : publicIdWithExtension;

      await cloudinary.uploader.destroy(
        publicId
      );

      user.profileImage = null;

      await user.save();

      res.json({
        message:
          'Profile image deleted successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        'Profile image delete error:',
        error.message
      );

      res.status(500).json({
        message:
          'Could not delete profile image',
      });
    }
  }
);

// Change password
router.put(
  '/change-password',
  protect,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            'Current password and new password are required',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message:
            'New password must be at least 6 characters',
        });
      }

      const user = await User.findById(
        req.userId
      );

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (!user.password) {
        return res.status(400).json({
          message:
            'Password change is not available for Google accounts',
        });
      }

      const isCurrentPasswordValid =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          message:
            'Current password is incorrect',
        });
      }

      const isSamePassword =
        await bcrypt.compare(
          newPassword,
          user.password
        );

      if (isSamePassword) {
        return res.status(400).json({
          message:
            'New password must be different from your current password',
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password = hashedPassword;

      await user.save();

      res.json({
        message:
          'Password changed successfully',
      });
    } catch (error) {
      console.error(
        'Change password error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

module.exports = router;