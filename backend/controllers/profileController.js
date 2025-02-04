const User = require('../models/user');

const getUserProfile = async (req, res) => {
  const { id } = req.params;  // Extract user ID from params
  console.log('User ID received:', id);  // Debugging line

  try {
    const user = await User.findByPk(id);  // Use findByPk to find by primary key
    console.log('User found:', user);  // Debugging line

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);  // Send the user data back as the response
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getUserProfile };
