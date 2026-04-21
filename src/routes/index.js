const express = require('express');
const router = express.Router();

router.use('/auth',          require('../modules/auth/auth.routes'));
router.use('/users',         require('../modules/users/user.routes'));
router.use('/donors',        require('../modules/donors/donor.routes'));
router.use('/requests',      require('../modules/requests/request.routes'));
router.use('/bloodbank',     require('../modules/bloodbank/bloodbank.routes'));
router.use('/notifications', require('../modules/notifications/notification.routes'));

module.exports = router;
