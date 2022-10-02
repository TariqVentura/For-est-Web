const express = require('express');
const router = express.Router();
const crud = require('../controllers/crud');

router.get('/', (req, res) => {
    res.render('login', {alert: true, alertTitle: "Bienvenid@!", alertMessage: "Bienvenid@ al Sistema For-est, ingresa tus credenciales para continuar", alertIcon: "info", result: 1})
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
router.get('/login/logout', crud.logout);
router.get('/description/:id_publicacion/:id_estudiante/:usuario', crud.public);
module.exports = router;