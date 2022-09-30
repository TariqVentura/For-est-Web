const conexion = "server=.;Database=Base_Expo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const sql = require('msnodesqlv8');
let md5 = require('md5');
const Layouts = require('express-ejs-layouts');
var usuario = "";
var asdf = "";
const fs = require('fs');
const Swal = require('sweetalert2');
const fecha = new Date();
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


exports.inicio = (req, res) => {
    usuario = req.body.usuario;
    const clave = req.body.clave;
    let password = md5(clave);
    sql.query(conexion, "select a.clave, b.id_estudiante from usuarios a, estudiantes b where a.usuario = '" + usuario + "' and b.carnet = '" + usuario + "'", async (error, resultado) => {
        if (resultado.length == 0) {
            res.render('login', { alert: true, alertTitle: "Estudiante inexistente", alertIcon: "error" })
        } else {
            sql.query(conexion, "select * from usuarios where usuario = '" + usuario + "' and clave = '" + password + "'", async (err, response) => {
                if (response.length == 0) {
                    res.render('login', { alert: true, alertTitle: "Credenciales erroneas", alertIcon: "error" })
                } else {
                    let pswrd = md5(usuario + "PU123")
                    sql.query(conexion, "select clave from usuarios where clave = '" + pswrd + "'", (req, respuesta) => {
                        if (respuesta.length == 0) {
                            sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
                                res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Acceso permitido", alertIcon: "success" })
                            })
                        } else {
                            res.render('changepassword', { msg: usuario, resultado: resultado, alert: true, alertTitle: "Complete lo siguiente", alertIcon: "info" })
                        }
                    })

                }
            })
            // if (result == finalstring) {
            //     console.log('acceso')
            // } else {
            //     console.log('clave erronea')
            // }
        }
    })
}

exports.password = (req, res) => {
    const usuario = req.body.usuario;
    let clave = md5(req.body.clave);
    let password = md5(req.body.password);
    const email = req.body.correo;
    const phone = req.body.telefono;
    const id_estudiante = req.body.id_estudiante;
    console.log(clave + " " + password)
    if (clave == password) {
        if (password == md5(usuario + "PU123")) {
            sql.query(conexion, "select id_estudiante from estudiantes where carnet = '" + usuario + "'", (req, resultado) => {
                res.render('changepassword', { msg: usuario, resultado: resultado, alert: true, alertTitle: "Ingrese una contraseña diferente", alertIcon: "warning" })
            })
        } else {
            sql.query(conexion, "update usuarios set clave = '" + password + "' where usuario = '" + usuario + "'", (err, res) => {
                if (err) {
                    res.send('error al cambiar la contraseña' + err);
                }
            })
            sql.query(conexion, "insert into contacto_estudiantes values('" + phone + "', '" + email + "', '" + id_estudiante + "')", (error, result) => {
                if (error) {
                    res.send('error al añadir los contactos' + error)
                } else {
                    res.render('login', { alert: true, alertTitle: "Bienvenidx!", alertMessage: "Bienvenidx al Sistema For-est, ingresa tus credenciales para continuar", alertIcon: "info" })
                }
            })
        }
    } else {
        res.send('Las contraseñas ingresadas no coinciden')
    }
}

exports.apply = (req, res) => {
    const id_estudiante = req.body.id_estudiante;
    const id_empresa = req.body.id_empresa;
    const id_publicacion = req.body.id_publicacion;
    const id_estado_peticion = req.body.id_estado_peticion;
    const usuario = req.body.usuario;
    sql.query(conexion, "select * from peticiones where id_estudiante = '" + id_estudiante + "' and id_publicacion = '" + id_publicacion + "'", (req, result) => {
        if (result.length == 0) {
            sql.query(conexion, "insert into peticiones values('" + id_estudiante + "', '" + id_empresa + "', '" + id_publicacion + "', '" + id_estado_peticion + "')", (error, results) => {
                if (error) {
                    res.send('no funciono D:');
                } else {
                    sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
                        res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Se ha enviado la solicitud", alertIcon: "success" })
                    })
                }
            })
        } else {
            sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
                res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Ya ha enviado una peticion para esta publicacion", alertIcon: "warning" })
            })
        }
    })

}

exports.resources = (req, res) => {
    const usuario = req.body.username;
    console.log(usuario)
    res.render('resources', { msg: usuario });
}

exports.schedule = (req, res) => {
    const usuario = req.body.usuario;
    sql.query(conexion, "select id_estudiante, carnet from estudiantes where carnet = ?", [usuario], async (error, results) => {
        sql.query(conexion, "select max(a.horas_acumuladas) as total from bitacoras a, estudiantes b where a.id_estudiante = b.id_estudiante and b.carnet = ?", [usuario], async (error, result) => {
            res.render('schedule', { msg: usuario, results: results, result: result, alert: true, alertTitle: "Ingrese lo que se pide", alertIcon: "info" });
        })
    })
}

exports.document = (req, res) => {
    const d = fecha.getFullYear() + "-" + month[fecha.getMonth()] + "-" + fecha.getDate()
    const he = req.body.entrada;
    const hs = req.body.salida;
    const act = req.body.actividad;
    const imgPath = req.body.imgPath;
    const id_estudiante = req.body.id_estudiante;
    const usuario = req.body.carnet;
    const ht = hs.replace(":", ".") - he.replace(":", ".");
    const hac = parseInt(hs.replace(":", ".")) - parseInt(he.replace(":", "."));
    var htr = parseInt(ht) + "." + Math.round((ht - parseInt(ht)) * 100);
    if (hac > htr) {
        htr = parseInt(htr) + "." + (60 - Math.round((hac - htr) * 100))
    }
    var ha = req.body.hora_post;
    if (ha.length === 0) {
        ha = 0;
    }
    console.log(ha)
    var has;
    var har;
    var hahtr = parseInt(htr)
    var haha = parseInt(ha)
    var hae = hahtr + haha;
    var had = (Math.round(((htr - parseInt(htr)) * 100) + ((ha - parseInt(ha)) * 100)))
    if (had > 60) {
        has = (had - 60)
        har = (hae + 1) + "." + has
    } else if (had < 60) {
        har = (hae + "." + had)
    } else if (had === 60) {
        har = (hae + 1)
    }
    sql.query(conexion, "select * from bitacoras where id_estudiante = '" + id_estudiante + "' and fecha = '" + d + "'", async (error, resultados) => {
        if (resultados.length == 0) {
            sql.query(conexion, "insert into bitacoras values('" + d + "', '" + he + "', '" + hs + "', '" + act + "', '" + htr + "', '" + har + "', '" + imgPath + "','" + id_estudiante + "')", async (error, result) => {
                if (error) {
                    throw error;
                } else {
                    sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
                        res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Se ha llenado la bitacora de este dia", alertIcon: "success" })
                    })
                }
            })
        } else {
            sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
                res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Ya ha enviado una bitacora este dia", alertIcon: "warning" })
            })
        }
    })
}

exports.doc = (req, res) => {
    const id_estudiante = req.body.id_estudiante;
    const carnet = req.body.carnet;
    sql.query(conexion, "select * from bitacoras where id_estudiante = ?", [id_estudiante], async (err, results) => {
        if (err) {
            throw err
        } else {
            sql.query(conexion, "select * from alumnos where carnet = ?", [carnet], async (error, result) => {
                if (error) {
                    throw error;
                } else {
                    res.render('doc', { results: results, result: result })
                }
            })
        }
    })
}

exports.recup = (req, res) => {
    const usuario = req.params.usuario;
    sql.query(conexion, "select * from usuarios where usuario = ?", [usuario], async (error, result) => {
        if (error) {
            throw error
        } else {
            if (result.length === 0) {
                res.render('login', { alert: true, alertTitle: "Usuario inexistente", alertIcon: "error"})
            } else {
                res.render('recup', {result:result})
            }
        }
    })
} 

exports.soli = (req, res) => {
    const id_usuario = req.body.id_usuario;
    const situacion = req.body.situacion;
    sql.query(conexion, "insert into solicitudes values('" + situacion + "', '" + id_usuario + "', 1)", async(error, result) => {
        if (error) {
            throw error;
        } else {
            res.render('login', { alert: true, alertTitle: "Solicitud enviada", alertIcon: "success" })
        }
    })
}