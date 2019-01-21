define(function (require) {
    let database = function () {
        this.init = function () {
            this.db = window.sqlitePlugin.openDatabase({ name: 'flat.db', location: 'default' });
        };
        this.whereValues = [];
        this.createTable = function (table, fields, success, drop) {
            if (_.isUndefined(fields)) {
                return;
            }
            window.Veon.loader.show();
            this.init();
            var query = [];
            if (drop != undefined) {
                if (drop) {
                    query[query.length] = 'DROP TABLE IF EXISTS ' + table;
                }
            }
            query[query.length] = 'CREATE TABLE IF NOT EXISTS ' + table + ' (' + fields.join(", ") + ')';
            this.db.sqlBatch(query, function () {
                window.Veon.loader.hide();
                success(true);
            }, function (error) {
                window.Veon.loader.hide();
                console.error('SQL batch ERROR: ' + error.message);
            });
        };
        this.select = function (fields) {
            if (fields.constructor === Array) {
                this.selectKey = fields.join(", ");
            } else {
                throw 'invalid argument';
            }
        };
        this.where = function (operator, field, value) {
            if (this.whereKey == undefined) {
                this.whereKey = {};
                this.whereValues = [];
            }
            if (this.whereKey[operator] == undefined) {
                this.whereKey[operator] = [];
            }
            if (value.constructor === Array) {
                this.whereKey[operator][this.whereKey[operator].length] = field + " IN ?";
            } else if (typeof value !== 'object') {
                this.whereKey[operator][this.whereKey[operator].length] = field + "= ?";
            } else {
                throw 'invalid where condition argument';
            }
            this.whereValues[this.whereValues.length] = value;
        };
        this.table = function (table) {
            this.tableKey = table;
        };
        this.reset_query = function () {
            this.selectKey = "";
            this.whereKey = {};
            this.whereValues = [];
            this.tableKey = "";
        };
        this.alert = function (data) {
            console.log(JSON.stringify(data));
            alert(JSON.stringify(data));
        };
        this.updateData = function (data, table, where, success) {
            if (data.constructor === Array) {
                throw "invalid argument";
            }
            window.Veon.loader.show();
            var sql = "Update " + table + " SET ";
            var whereValues = [];
            var whereCond = [];
            var update = [];
            var self = this;
            _.each(data, function (v, i) {
                if (window.Veon.object_key_exists(where, i)) {
                    return;
                }
                if (!window.Veon.object_value_exists(window.Veon.fields[table], i)) {
                    return;
                }
                update[update.length] = i + "=?";
                whereValues[whereValues.length] = v;
            });
            sql = sql + update.join(', ') + " WHERE ";
            _.each(where, function (v, i) {
                if (!window.Veon.object_value_exists(window.Veon.fields[table], i)) {
                    return;
                }
                whereValues[whereValues.length] = v;
                whereCond[whereCond.length] = i + "=?";
            });
            sql = sql + whereCond.join(' AND ');
            this.db.executeSql(sql, whereValues, function (rs) {
                window.Veon.loader.hide();
                console.log("updated");
                success(rs);
            }, function (error) {
                window.Veon.loader.hide();
                console.error('Update SQL statement ERROR: ' + error.message);
            });
        };
        this.insertData = function (data, table, success) {
            if (data.constructor === Array) {
                window.Veon.loader.show();
                var self = this;
                var d = [];
                var valQues = [];
                var valFields = [];
                _.each(data, function (v) {
                    values = [];
                    _.each(v, function (val, field) {
                        if (!window.Veon.object_value_exists(window.Veon.fields[table], field)) {
                            return;
                        }
                        valFields[valFields.length] = field;
                        if (val != null && (val.constructor === Array || typeof val === 'object')) {
                            values[values.length] = JSON.stringify(val);
                        } else {
                            values[values.length] = val;
                        }
                    });
                    _.each(window.Veon.fields[table], function () {
                        valQues[valQues.length] = '?';
                    });
                    d[d.length] = ['INSERT INTO ' + table + '(' + valFields.join(",") + ') VALUES (' + valQues.join(", ") + ')', values];
                    valQues = [];
                    valFields = [];
                    values = [];
                });
                // this.alert(d);
                this.db.sqlBatch(d, function () {
                    window.Veon.loader.hide();
                    console.log("inserted succesfully");
                    success(true);
                    // alert('inserted pol');
                }, function (error) {
                    window.Veon.loader.hide();
                    console.log('SQL batch ERROR: ' + error.message);
                });
            } else {
                throw 'Invalid Argument';
            }
        };

        this.execute = function (success) {
            this.init();
            var self = this;
            if (_.isEmpty(this.tableKey)) {
                throw 'table not defined';
            }
            window.Veon.loader.show();
            var query = 'SELECT ' + this.selectKey + ' FROM ' + this.tableKey;
            if (!_.isEmpty(this.whereValues)) {
                query = query + ' WHERE ';
                _.each(this.whereKey, function (arr, operator) {
                    let cond = arr.join(' ' + operator + ' ');
                    query = query + ' ' + cond;
                });
            }
            // this.alert(query);
            this.db.executeSql(query, this.whereValues, function (rs) {
                window.Veon.loader.hide();
                success(rs);
            }, function (error) {
                window.Veon.loader.hide();
                console.error('SELECT SQL statement ERROR: ' + error.message);
            });
            self.reset_query();
        };
    };
    return database;
});