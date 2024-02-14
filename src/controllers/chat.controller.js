const firebaseService = require('../services/chat.service');

class FirebaseController {
  async createData(req, res) {
    try {
      const data = req.body;
      const key = await firebaseService.createData(data);
      res.status(201).json({ message: 'Data created', key });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async readData(req, res) {
    try {
      const key = req.params.key;
      const data = await firebaseService.readData(key);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateData(req, res) {
    try {
      const key = req.params.key;
      const newData = req.body;
      await firebaseService.updateData(key, newData);
      res.status(200).json({ message: 'Data updated' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteData(req, res) {
    try {
      const key = req.params.key;
      await firebaseService.deleteData(key);
      res.status(200).json({ message: 'Data deleted' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new FirebaseController();
