const validateDevice = (req, res, next) => {
  const { name, category, dataType } = req.body;

  if (name == null) {
    res.status(400).json({ error: "Device name is required" });
  }

  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "Device name must be a non-empty string" });
  }

  if (category == null) {
    res.status(400).json({ error: "Category is required" });
  }

  if (typeof category !== "string" || category.trim() === "") {
    res.status(400).json({ error: "Category must be a non-empty string" });
  }

  if (dataType == null) {
    res.status(400).json({ error: "Data type is required" });
  }

  if (dataType !== "numeric" && dataType !== "text") {
    res
      .status(400)
      .json({ error: "Data type must be either 'numeric' or 'text'" });
  }

  req.body.name = name.trim();
  req.body.category = category.trim().toLowerCase(); // categories are case-insensitive

  next();
};

module.exports = validateDevice;
