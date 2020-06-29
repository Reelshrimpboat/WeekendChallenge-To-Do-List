const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all tasks
router.get('/ASC', (req, res) => {
  let queryText = 'SELECT * FROM "tasks" ORDER BY "completed" ASC;';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting tasks', error);
    res.sendStatus(500);
  });
});
router.get('/DESC', (req, res) => {
  let queryText = 'SELECT * FROM "tasks" ORDER BY "completed" DESC;';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting tasks', error);
    res.sendStatus(500);
  });
});

router.post('/',  (req, res) => {
  let newTask = req.body;
  //console.log(`Adding task`, newTask);

  let queryText = `INSERT INTO "tasks" ("task", "completed")
                   VALUES ($1, 'N');`;
  pool.query(queryText, [newTask.task])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new task`, error);
      res.sendStatus(500);
    });
});


router.put('/:id',  (req, res) => {
  let task = req.body; // task with updated content
  let id = req.params.id; // id of the task to update

  console.log(`Updating task ${id} with `, task);

  let queryText = `UPDATE "tasks" SET completed = 'Y'
        WHERE "id" = $1`

  pool.query(queryText, [id])
  .then((result) => {
    console.log('Update has worked!', result);
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log('Update has failed.', err);
    res.sendStatus(500);
  })

});


router.delete('/:id',  (req, res) => {
  let id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);
  let queryText = `
    DELETE FROM "tasks"
    WHERE id = ${id}
    `;

  pool.query(queryText)
    .then((result) => {
      console.log('Delete has worked!', result);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('Delete has failed.', err);
      res.sendStatus(500);
    });

});

router.get('/:id', (req, res) => {
   let id = req.params.id;
   console.log('Edit route called with id of', id);
  let queryText = `SELECT * FROM "tasks" WHERE "id" = ${id};`;
  pool.query(queryText).then(result => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch(error => {
      console.log('error getting tasks', error);
      res.sendStatus(500);
    });
});

//edit request
router.put('/edit/:id', (req, res) => {
  let task = req.body.task; // task with updated content
  let id = req.params.id; // id of the task to update

  console.log(`Updating task ${id} with `, task);

  let queryText = `UPDATE "tasks" SET "task" = $1 , "completed" = 'N'
        WHERE "id" = ${id};`

  pool.query(queryText, [task])
    .then((result) => {
      console.log('db is happy', result);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('uh oh, db is mad.', err);
      res.sendStatus(500);
    })

});

module.exports = router;
