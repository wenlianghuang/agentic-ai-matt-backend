import express from 'express';

const router = express.Router();

router.get('/data',(req, res) => {
    res.json({ message: 'Hello from the API!' });
});

module.exports = router;