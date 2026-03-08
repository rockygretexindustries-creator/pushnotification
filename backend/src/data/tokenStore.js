// In-memory token storage
let tokens = [];

const tokenStore = {
  // Add or update a token
  addToken: (userId, token, deviceType) => {
    // Check if token already exists
    const existingIndex = tokens.findIndex(
      (t) => t.token === token && t.userId === userId
    );

    if (existingIndex !== -1) {
      // Update existing token
      tokens[existingIndex] = {
        userId,
        token,
        deviceType,
        updatedAt: new Date().toISOString(),
      };
      return { isNew: false, token: tokens[existingIndex] };
    }

    // Add new token
    const newToken = {
      userId,
      token,
      deviceType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tokens.push(newToken);
    return { isNew: true, token: newToken };
  },

  // Get all tokens for a user
  getTokensByUserId: (userId) => {
    return tokens.filter((t) => t.userId === userId);
  },

  // Get all tokens
  getAllTokens: () => {
    return tokens;
  },

  // Remove a specific token
  removeToken: (token) => {
    const initialLength = tokens.length;
    tokens = tokens.filter((t) => t.token !== token);
    return initialLength !== tokens.length;
  },

  // Remove all tokens for a user
  removeUserTokens: (userId) => {
    const initialLength = tokens.length;
    tokens = tokens.filter((t) => t.userId !== userId);
    return initialLength - tokens.length;
  },

  // Clear all tokens
  clearAll: () => {
    const count = tokens.length;
    tokens = [];
    return count;
  },

  // Get token count
  getCount: () => {
    return tokens.length;
  },
};

module.exports = tokenStore;
