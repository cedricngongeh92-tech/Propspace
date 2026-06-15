export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'PropSpace API is running',
  });
};
