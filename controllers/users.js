const { validationResult } = require('express-validator');
const platform = require('../utils/platform');
const userlist = require('../models/User');
const aicontroller = require('./ai');
const { asyncHandler } = require('../utils/errors');
const { sendValidationError } = require('../utils/response');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');

exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }

  const { name, email, password, avatar } = req.body;
  const result = await platform.register({ name, email, password, avatar });
  return res.status(HTTP_STATUS.CREATED).json({
    token: result.token,
    user: result.user,
    success: true,
    message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
  });
});

exports.connectUser = asyncHandler(async (req, res) => {
  try {
    aicontroller.buildFaithfulImagePrompt("normal");
  } catch (err) {
    console.error(err.message);
    process.exit(-1);
  }
});