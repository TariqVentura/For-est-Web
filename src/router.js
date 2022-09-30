const express = require('express');
const router = express.Router();
const conexion = "server=.;Database=Base_Expo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const sql = require('msnodesqlv8');
const crud = require('../controllers/crud');

router.get('/', (req, res) => {
    res.render('login', {alert: true, alertTitle: "Bienvenidx!", alertMessage: "Bienvenidx al Sistema For-est, ingresa tus credenciales para continuar", alertIcon: "info", result: 1})
    // sql.query(conexion, 'select * from usuarios', (err, results) => {
    //     if (err) {
    //         throw err;
    //     } else {
    //         res.send(results);
    //     }
    // })
});

router.post('/inicio', crud.inicio);
router.post('/apply', crud.apply);
router.post('/resources', crud.resources);
router.post('/login', crud.password);
router.post('/schedule', crud.schedule);
router.post('/document', crud.document);
router.post('/doc', crud.doc);
router.get('/login/:usuario', crud.recup);
router.post('/soli', crud.soli)
module.exports = router;