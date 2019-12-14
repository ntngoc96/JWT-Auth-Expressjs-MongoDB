const httpStatus = require('http-status');

async function getUserInformation(req, res) {
  try {
    res.status(httpStatus.OK).json(req.user);
  } catch (error) {
    console.log(error);

    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = { getUserInformation }