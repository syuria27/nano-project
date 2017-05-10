var mysql = require("mysql");
const isset = require('isset');
const md5 = require("md5");

function LOGIN_ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

LOGIN_ROUTER.prototype.handleRoutes = function (router, pool) {

    router.post("/login", function (req, res) {
        var data = {
            error: true,
            error_msg: "",
        };

        if (isset(req.body.username) && isset(req.body.password)) {
            var query = `SELECT nama FROM login WHERE username = ? AND password = ?`;
            var table = [req.body.username, md5(req.body.password)];
            query = mysql.format(query, table);
            pool.getConnection(function (err, connection) {
                connection.query(query, function (err, rows) {
                    connection.release();
                    if (err) {
                        res.status(500);
                        data.error_msg = "Error executing MySQL query";
                        res.json(data);
                    } else {
                        if (rows.length != 0) {
                            data.error = false;
                            data.error_msg = 'Success..';
                            data.user = rows[0].nama;
                            res.json(data);
                        } else {
                            data.error_msg = 'Login fail check username or password..';
                            res.status(403);
                            res.json(data);
                        }
                    }
                });
            });
        } else {
            data.error_msg = 'Missing some params..';
            res.status(400);
            res.json(data);
        }
    });
}

module.exports = LOGIN_ROUTER;
