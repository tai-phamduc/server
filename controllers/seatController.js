// @desc    Get seat types
// @route   GET /api/seats/types
// @access  Public
const getSeatTypes = async (req, res) => {
  try {
    // Define seat types with their descriptions and price multipliers
    const seatTypes = [
      {
        type: 'standard',
        description: 'Standard comfortable seats',
        priceMultiplier: 1.0,
        color: '#3498db',
        icon: 'chair'
      },
      {
        type: 'premium',
        description: 'Premium seats with extra legroom',
        priceMultiplier: 1.5,
        color: '#2ecc71',
        icon: 'chair-comfort'
      },
      {
        type: 'vip',
        description: 'VIP recliner seats with service button',
        priceMultiplier: 2.0,
        color: '#f1c40f',
        icon: 'chair-fancy'
      },
      {
        type: 'couple',
        description: 'Loveseat for two people',
        priceMultiplier: 2.5,
        color: '#e74c3c',
        icon: 'loveseat'
      },
      {
        type: 'accessible',
        description: 'Wheelchair accessible space',
        priceMultiplier: 1.0,
        color: '#9b59b6',
        icon: 'wheelchair'
      }
    ];

    res.json(seatTypes);
  } catch (error) {
    console.error('Error getting seat types:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSeatTypes
};
