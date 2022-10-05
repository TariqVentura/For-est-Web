let md5 = require('md5');
const conexion = "server=.;Database=Base_Expo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const sql = require('msnodesqlv8');
const Layouts = require('express-ejs-layouts');
var usuario = "";
var asdf = "";
const fs = require('fs');
const Swal = require('sweetalert2');
const fecha = new Date();
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const model = require('../Models/model');
var Connection = require('tedious').Connection;
var config = {
    server: 'exposerver.database.windows.net',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'sm', //update me
            password: '9u7t90JxXtB9'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'Base_Expo'  //update me
    }
};
exports.inicio = (req, res) => {
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("validacion de usuario");
        executeStatement();
    });

    connection.connect();

    var Request = require('tedious').Request
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        const usuario = req.body.usuario;
        const clave = md5(req.body.clave)
        request = new Request("SELECT clave from usuarios where usuario = '" + usuario + "'", async (err, count, results) => {
            if (err) {
                console.log(err);
            } else {
                if (count === 0) {
                    res.render('login', { alert: true, alertTitle: "Estudiante inexistente", alertIcon: "error" })
                }
            }

        });
        var result = "";
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                } else {
                    result += column.value + " ";
                    console.log(result)
                    console.log(clave)
                    var connection = new Connection(config);
                    connection.on('connect', function (err) {
                        // If no error, then good to proceed.  
                        console.log("validacion de credenciales");
                        executeStatement1();
                    });
                    connection.connect();

                    var Request = require('tedious').Request
                    var TYPES = require('tedious').TYPES;
                    function executeStatement1() {
                        const usuario = req.body.usuario;
                        const clave = md5(req.body.clave)
                        request = new Request("select b.id_estudiante from [dbo].[usuarios] a, [dbo].[estudiantes] b where a.id_usuario = b.id_usuario and b.carnet = '" + usuario + "' and a.clave = '" + clave + "'", async (err, conute) => {
                            console.log(conute)
                            if (err) {
                                console.log(err)
                            } else {
                                if (conute === 0) {
                                    res.render('login', { alert: true, alertTitle: "Credenciales erroneas", alertIcon: "error" })
                                }
                            }
                        })
                        var response = "";
                        request.on('row', function (columns) {
                            columns.forEach(function (column) {
                                if (column.value === null) {

                                } else {
                                    response += column.value + " "
                                    console.log(response)
                                    if (clave === md5(usuario + 'PU123')) {
                                        res.render('changepassword', { msg: usuario, id_estudiante: response, alert: true, alertTitle: "Complete lo siguiente", alertIcon: "info" })
                                    } else {
                                        //renderizar index
                                        sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
                                            res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Acceso permitido", alertIcon: "success" })
                                        })
                                    }
                                }
                            })
                        });

                        request.on('done', function (rowCount, more) {
                            console.log(rowCount + ' rows returned');
                        });

                        // Close the connection after the final event emitted by the request, after the callback passes
                        request.on("requestCompleted", function (rowCount, more) {
                            connection.close();
                        });
                        connection.execSql(request);

                    }
                }
            });

        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
}

exports.password = (req, res) => {
    const usuario = req.body.usuario;
    let contra = req.body.clave
    let clave = md5(req.body.clave);
    let password = md5(req.body.password);
    const email = req.body.correo;
    const phone = req.body.telefono;
    const id_estudiante = req.body.id_estudiante;
    console.log(clave + " " + password)
    if (clave == password) {
        if (password == md5(usuario + "PU123")) {
            //vuelve a ingresar la contraseña default
            sql.query(conexion, "select id_estudiante from estudiantes where carnet = '" + usuario + "'", (req, resultado) => {
                res.render('changepassword', { msg: usuario, resultado: resultado, alert: true, alertTitle: "Elija una contraseña distinta a la anterior", alertIcon: "warning" })
            })
        } else {
            if (contra.length < 8) {
                sql.query(conexion, "select id_estudiante from estudiantes where carnet = '" + usuario + "'", (req, resultado) => {
                    res.render('changepassword', { msg: usuario, resultado: resultado, alert: true, alertTitle: "La contraseña debe contener almenos 8 caracteres", alertIcon: "warning" })
                })
            } else {
                var connection = new Connection(config);
                connection.on('connect', function (err) {
                    // If no error, then good to proceed.  
                    console.log("Connected");
                    executeStatement1();
                });

                connection.connect();

                var Request = require('tedious').Request
                var TYPES = require('tedious').TYPES;

                function executeStatement1() {
                    request = new Request("update usuarios set clave = @clave where usuario = @usuario", function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    request.addParameter('clave', TYPES.NVarChar, password);
                    request.addParameter('usuario', TYPES.NVarChar, usuario);
                    request.on('row', function (columns) {
                        columns.forEach(function (column) {
                            if (column.value === null) {
                                console.log('NULL');
                            } else {
                                console.log("Product id of inserted item is " + column.value);
                                //renderizar index
                            }
                        });
                    });

                    // Close the connection after the final event emitted by the request, after the callback passes
                    request.on("requestCompleted", function (rowCount, more) {
                        connection.close();
                    });
                    connection.execSql(request);
                }
                res.render('login', { alert: true, alertTitle: "Bienvenidx!", alertMessage: "Bienvenidx al Sistema For-est, ingresa tus credenciales para continuar", alertIcon: "info" })
            }
        }
    } else {
        sql.query(conexion, "select id_estudiante from estudiantes where carnet = '" + usuario + "'", (req, resultado) => {
            res.render('changepassword', { msg: usuario, resultado: resultado, alert: true, alertTitle: "Las contraseñas no coinciden", alertIcon: "warning" })
        })
    }
}

exports.apply = (req, res) => {
    const id_estudiante = req.body.id_estudiante;
    const id_empresa = req.body.id_empresa;
    const id_publicacion = req.body.id_publicacion;
    const id_estado_peticion = req.body.id_estado_peticion;
    const usuario = req.body.usuario;
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement1();
    });

    connection.connect();

    var Request = require('tedious').Request
    var TYPES = require('tedious').TYPES;

    function executeStatement1() {
        request = new Request("insert into peticiones values(@id_estudiante, @id_empresa, @id_publicacion, @id_estado_peticion)", function (err) {
            if (err) {
                console.log(err);
            }
        });
        request.addParameter('id_estudiante', TYPES.Int, id_estudiante);
        request.addParameter('id_empresa', TYPES.Int, id_empresa);
        request.addParameter('id_publicacion', TYPES.Int, id_publicacion);
        request.addParameter('id_estado_peticion', TYPES.Int, id_estado_peticion);
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    console.log("Product id of inserted item is " + column.value);
                }
            });
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
    sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
        res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Se ha enviado la solicitud", alertIcon: "success" })
    })
}

exports.resources = (req, res) => {
    const usuario = req.body.username;
    console.log(usuario)
    res.render('resources', { msg: usuario });
}

exports.schedule = (req, res) => {
    const usuario = req.body.usuario;
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement();
    });

    connection.connect();

    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request("select id_estudiante from estudiantes where carnet = '" + usuario + "'", function (err, count) {
            if (err) {
                console.log(err);
            }
        });
        var result = "";
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result += column.value + " ";
                }
            });
            console.log(parseInt(result));
            var connection = new Connection(config);
            connection.on('connect', function (err) {
                // If no error, then good to proceed.  
                console.log("Connected");
                executeStatement1();
            });

            connection.connect();

            var Request = require('tedious').Request;
            var TYPES = require('tedious').TYPES;

            function executeStatement1() {
                request = new Request("select max(a.horas_acumuladas) as total from bitacoras a, estudiantes b where a.id_estudiante = b.id_estudiante and b.carnet = '" + usuario + "'", function (err, count) {
                    if (err) {
                        console.log(err);
                    }
                });
                var response = "";
                request.on('row', function (columns) {
                    columns.forEach(function (column) {
                        if (column.value === null) {
                            console.log('NULL');
                        } else {
                            response += column.value + " ";
                        }
                    });
                    console.log(parseInt(response));
                    res.render('schedule', { msg: usuario, result: parseInt(result), response: parseInt(response), alert: true, alertTitle: "Ingrese lo que se pide", alertIcon: "info" });
                });

                request.on('done', function (rowCount, more) {
                    console.log(rowCount + ' rows returned');
                });

                // Close the connection after the final event emitted by the request, after the callback passes
                request.on("requestCompleted", function (rowCount, more) {
                    connection.close();
                });
                connection.execSql(request);
            }
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
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
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement2();
    });

    connection.connect();

    var Request = require('tedious').Request
    var TYPES = require('tedious').TYPES;

    function executeStatement2() {
        request = new Request("insert into bitacoras values(@fecha, @hora_entrada, @hora_salida, @tipo_actividad, @horas_totales, @horas_acumuladas, @firma, @id_estudiante)", function (err) {
            if (err) {
                console.log(err);
            }
        });
        request.addParameter('fecha', TYPES.NVarChar, d);
        request.addParameter('hora_entrada', TYPES.NVarChar, he);
        request.addParameter('hora_salida', TYPES.NVarChar, hs);
        request.addParameter('tipo_actividad', TYPES.NVarChar, act);
        request.addParameter('horas_totales', TYPES.NVarChar, htr);
        request.addParameter('horas_acumuladas', TYPES.NVarChar, har);
        request.addParameter('firma', TYPES.NVarChar, imgPath);
        request.addParameter('id_estudiante', TYPES.Int, id_estudiante);
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    console.log("Product id of inserted item is " + column.value);
                }
            });
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
    sql.query(conexion, 'select a.titulo, a.imagePath, a.id_empresa, a.id_publicacion, b.id_estudiante, b.carnet from publicaciones a, estudiantes b where a.id_especialidad = b.id_especialidad and b.carnet = ?', [usuario], async (error, results) => {
        res.render('index', { results: results, msg: usuario, frame: 'index-publicaciones.ejs', alert: true, alertTitle: "Se ha llenado la bitacora de este dia", alertIcon: "success" })
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
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement();
    });

    connection.connect();

    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request("select id_usuario from usuarios where usuario = '" + usuario + "'", function (err, count) {
            if (err) {
                console.log(err);
            } else {
                if (count === 0) {
                    res.render('login', { alert: true, alertTitle: "Usuario inexistente", alertIcon: "error" })
                }
            }
        });
        var result = "";
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result += column.value + " ";
                }
            });
            console.log(parseInt(result));
            res.render('recup', { result: parseInt(result), msg: usuario })
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
}

exports.soli = (req, res) => {
    const id_usuario = req.body.id_usuario;
    const situacion = req.body.situacion;
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement1();
    });

    connection.connect();

    var Request = require('tedious').Request
    var TYPES = require('tedious').TYPES;

    function executeStatement1() {
        request = new Request("insert into solicitudes values(@situacion, @id_estudiante, @id_estado_solicitud)", function (err) {
            if (err) {
                console.log(err);
            }
        });
        request.addParameter('situacion', TYPES.NVarChar, situacion);
        request.addParameter('id_estudiante', TYPES.Int, id_usuario);
        request.addParameter('id_estado_solicitud', TYPES.Int, 1);
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    console.log("Product id of inserted item is " + column.value);
                }
            });
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
    res.render('login', { alert: true, alertTitle: "Solicitud enviada", alertIcon: "success" })
}

exports.public = (req, res) => {
    const id_estudiante = req.params.id_estudiante;
    const id_publicacion = req.params.id_publicacion;
    const usuario = req.params.usuario;
    sql.query(conexion, "select b.titulo, b.texto, b.imagePath, c.empresa, c.id_empresa, b.fecha_finalizacion, b.id_publicacion   from publicaciones b, empresas c  where b.id_empresa = c.id_empresa and b.id_publicacion = ?", [id_publicacion], async (error, result) => {
        if (error) {
            throw error
        } else {
            sql.query(conexion, "select count(id_publicacion) as aspirantes from peticiones where id_publicacion = ?", [id_publicacion], async (err, results) => {
                if (err) {
                    throw err
                } else {
                    res.render('publicacion_id', { result: result, results: results, msg: usuario, id_estudiante: id_estudiante })
                }
            })
        }
    })
}

exports.logout = (req, res) => {
    res.redirect('login', { alert: true, alertTitle: "Usuario inexistente", alertIcon: "error" })
}