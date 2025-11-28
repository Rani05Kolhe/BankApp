const dbService = require("../services/db.service");

const getData = async (req, res, schema) => {
  try {
    const list = await dbService.findAllRecord(schema);
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal error", error });
  }
};

const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const saved = await dbService.createNewRecord(data, schema);
    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal error", error });
  }
};

const updateData = async (req, res, schema) => {
  try {
    const updated = await dbService.updateRecord(
      req.params.id,
      req.body,
      schema
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal error", error });
  }
};

const deleteData = async (req, res, schema) => {
  try {
    const deleted = await dbService.deleteRecord(req.params.id, schema);
    res.json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal error", error });
  }
};


module.exports = {
  getData,
  createData,
  updateData,
  deleteData,
};
