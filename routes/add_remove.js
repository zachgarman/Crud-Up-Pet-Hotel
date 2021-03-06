var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'pethotel'
}

var pool = new pg.Pool(config);

//
// router.get('/view', function (req, res) {
//   res.sendFile(path.join(__dirname, './public/views/add_remove.html'));
// });
router.get('/owners', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM owners;', function (err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
        res.send(result.rows);
      });
    } finally {
      done();
    }
  });
});

router.post('/pets', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT pet_name, animal_type, color FROM owners JOIN pets ON owners.id = pets.owners_id WHERE owners.id = $1;',
      [req.body.id], function (err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
        res.send(result.rows);
      });
    } finally {
      done();
    }
  });
});

router.post('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO pets (pet_name, animal_type, color, owner_id) VALUES ($1, $2, $3, $4)',
                  [req.body.petName, req.body.animalType, req.body.color, req.body.ownerID],
                  function (err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    } finally {
      done();
    }
  });
});

router.put('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('UPDATE pets SET pet_name=$2, animal_type=$3, color=$4 WHERE id=$1;',
                  [req.body.id, req.body.petName, req.body.animalType, req.body.color],
                  function (err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    } finally {
      done();
    }
  });
});

router.delete('/', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('DELETE FROM pets WHERE id=$1;', [req.body.id],
                 function (err, result) {
                  done();
                  if (err) {
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                  }

                  console.log('Got rows from the DB:', result.rows);
                  res.send(result.rows);
                  res.sendStatus(204);
                  done();
                });
  });
});

module.exports = router;
