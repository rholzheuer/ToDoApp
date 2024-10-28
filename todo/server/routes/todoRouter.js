import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { emptyOrRows } from '../helpers/utils.js';

const router = Router();

router.get('/', (req, res) => {
  pool.query('SELECT * FROM task', (error, result) => {
    if (error) {
      return next(error);
    }
    return res.status(200).json(emptyOrRows(result));
  });
});

router.post('/create', (req, res) => {
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING id',
        [req.body.description], 
        (error, result) => {
            pool.end();
            if (error) {
                return next(error);
            }
            return res.status(200).json({id: result.rows[0].id})
        }
    )
})

router.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        'DELETE FROM task WHERE id = $1',
        [id],
        (error, result) => {
            pool.end(); // Close the pool connection
            if (error) {
                return next(error);
            }
            return res.status(200).json({ id: id });
        }
    );
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
  });

router.listen(port, () => {
    console.log(`Server is running on port ${port}`) 
})
