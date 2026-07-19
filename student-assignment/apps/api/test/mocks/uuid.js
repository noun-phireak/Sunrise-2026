const crypto = require('crypto');

module.exports = {
    v4: () => crypto.randomUUID(),
    v1: () => 'mock-uuid-v1',
    v3: () => 'mock-uuid-v3',
    v5: () => 'mock-uuid-v5',
    validate: () => true,
};
