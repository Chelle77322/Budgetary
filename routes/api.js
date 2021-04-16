const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, result) => {
  Transaction.create(body)
    .then(dbTransaction => {
      result.json(dbTransaction);
    })
    .catch(error => {
      result.status(404).json(error);
    });
});

router.post("/api/transaction/bulk", ({body}, result) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      result.json(dbTransaction);
    })
    .catch(error => {
      result.status(404).json(error);
    });
});

router.get("/api/transaction", (request, result) => {
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      result.json(dbTransaction);
    })
    .catch(error => {
      result.status(404).json(error);
    });
});

module.exports = router;