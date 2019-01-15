define(function (require) {
    let database = function () {
        this.init = function () {
            this.db = window.sqlitePlugin.openDatabase({ name: 'flat.db', location: 'default' });
        };
        this.whereValues = [];
        this.createTable = function (table, fields, success, drop) {
            this.init();
            var query = [];
            if (drop != undefined) {
                if (drop) {
                    query[query.length] = 'DROP TABLE IF EXISTS ' + table;
                }
            }
            query[query.length] = 'CREATE TABLE IF NOT EXISTS ' + table + ' (' + fields.join(", ") + ')';
            this.db.sqlBatch(query, function () {
                success(true);
            }, function (error) {
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
        }
        this.reset_query = function () {
            this.selectKey = "";
            this.whereKey = {};
            this.whereValues = [];
            this.tableKey = "";
        }
        this.alert = function (data) {
            console.log(JSON.stringify(data));
            alert(JSON.stringify(data));
        };
        this.testInsert = function () {
            var self = this;
            try {
                this.createTable('user', ['id', 'description', 'login_status'], function (res) {
                    data = [{ id: "1", login_status: "1", description: "{ \"id\": \"1\", \"user_name\": \"admin\", \"name\": \"Admin User\", \"access\": \"1\", \"distname\": \"Lohardaga\", \"distid\": \"100\", \"blockname\": \"Kuru\", \"blockid\": \"1003\", \"geodata\": { \"10004\": { \"name\": \"Barki Chanpi\", \"units\": { \"100066\": { \"name\": \"Banduwa\" }, \"100065\": { \"name\": \"Barkichanpi\" }, \"100067\": { \"name\": \"Chhotkichanpi\" }, \"100055\": { \"name\": \"Chulhapani\" }, \"100062\": { \"name\": \"Chund\" }, \"100059\": { \"name\": \"Dhawra\" }, \"100064\": { \"name\": \"Dubang\" }, \"100061\": { \"name\": \"Hotwar\" }, \"100056\": { \"name\": \"Khamhar\" }, \"100063\": { \"name\": \"Kundgara\" }, \"100057\": { \"name\": \"Masiyatu\" }, \"100060\": { \"name\": \"Rocho\" }, \"100058\": { \"name\": \"Salgi\" } } }, \"10008\": { \"name\": \"Bisramgarh\", \"units\": { \"100109\": { \"name\": \"Bisramgarh\" }, \"100116\": { \"name\": \"Doba\" }, \"100117\": { \"name\": \"Jido\" }, \"100119\": { \"name\": \"Jilinga\" }, \"100110\": { \"name\": \"Jima\" }, \"100113\": { \"name\": \"Kundi\" }, \"100114\": { \"name\": \"Kuru\" }, \"100118\": { \"name\": \"Maradih\" }, \"100115\": { \"name\": \"Taku\" }, \"100111\": { \"name\": \"Tati\" }, \"100112\": { \"name\": \"Tiko\" } } }, \"10009\": { \"name\": \"Chiri\", \"units\": { \"100131\": { \"name\": \"Chandu\" }, \"100125\": { \"name\": \"Chiri\" }, \"100129\": { \"name\": \"Jangi\" }, \"100120\": { \"name\": \"Jariyo\" }, \"100121\": { \"name\": \"Kamle\" }, \"100126\": { \"name\": \"Karak\" }, \"100128\": { \"name\": \"Kolsimri\" }, \"100127\": { \"name\": \"Lawagain\" }, \"100130\": { \"name\": \"Nontilo\" }, \"100123\": { \"name\": \"Opa\" }, \"100122\": { \"name\": \"Sukumar\" }, \"100124\": { \"name\": \"Sundru\" } } }, \"10010\": { \"name\": \"Hanhat\", \"units\": { \"100139\": { \"name\": \"Chirna\" }, \"100142\": { \"name\": \"Gitilgarh\" }, \"100145\": { \"name\": \"Hanhat\" }, \"100143\": { \"name\": \"Huddu\" }, \"100137\": { \"name\": \"Jajgunda\" }, \"100136\": { \"name\": \"Jingi\" }, \"100132\": { \"name\": \"Jonjro\" }, \"100141\": { \"name\": \"Kakargarh\" }, \"100140\": { \"name\": \"Lapur\" }, \"100138\": { \"name\": \"Mahugaon\" }, \"100133\": { \"name\": \"Makra\" }, \"100135\": { \"name\": \"Rahe\" }, \"100134\": { \"name\": \"Tan\" }, \"100144\": { \"name\": \"Torang\" } } }, \"10013\": { \"name\": \"Kairo\", \"units\": { \"100180\": { \"name\": \"Bardin\" }, \"100185\": { \"name\": \"Baxi\" }, \"100186\": { \"name\": \"Eradon\" }, \"100182\": { \"name\": \"Jonjro\" }, \"100183\": { \"name\": \"Kairo\" }, \"100189\": { \"name\": \"Kharta\" }, \"100187\": { \"name\": \"Sarhawe\" }, \"100179\": { \"name\": \"Sinjo\" }, \"100181\": { \"name\": \"Sukurhutu\" }, \"100188\": { \"name\": \"Tati\" }, \"100178\": { \"name\": \"Umri\" }, \"100177\": { \"name\": \"Urumuru\" }, \"100184\": { \"name\": \"Utka\" } } }, \"10020\": { \"name\": \"Pandra\", \"units\": { \"100276\": { \"name\": \"Baridih\" }, \"100287\": { \"name\": \"Barmartola Itra\" }, \"100284\": { \"name\": \"Chandlaso\" }, \"100288\": { \"name\": \"Charra\" }, \"100282\": { \"name\": \"Chetar\" }, \"100281\": { \"name\": \"Chitakoni\" }, \"100283\": { \"name\": \"Henjla\" }, \"100277\": { \"name\": \"Hurhad\" }, \"100285\": { \"name\": \"Kokar\" }, \"100278\": { \"name\": \"Makandu\" }, \"100279\": { \"name\": \"Merle\" }, \"100280\": { \"name\": \"Pandra\" }, \"100286\": { \"name\": \"Phulsari\" }, \"100275\": { \"name\": \"Rajrom\" } } } } } " }];
                    self.insertData(data, 'user', function (res) {
                        self.select(['id', 'description', 'login_status']);
                        self.table('user');
                        self.where('AND', 'login_status', "1");
                        self.execute();
                    });
                }, true);
            } catch (error) {
                console.log('ERROR - ', error.message);
            }

        }
        this.updateData = function (data, table, where, success) {
            if (data.constructor === Array) {
                throw "invalid argument";
            }
            var sql = "Update " + table + " SET ";
            var whereValues = [];
            var whereCond = [];
            var update = [];
            var self = this;
            _.each(data, function (v, i) {
                if (window.Veon.object_key_exists(where, i)) {
                    return;
                }
                update[update.length] = i + "=?";
                whereValues[whereValues.length] = v;
            });
            sql = sql + update.join(', ') + " WHERE ";
            _.each(where, function (v, i) {
                whereValues[whereValues.length] = v;
                whereCond[whereCond.length] = i + "=?";
            });
            sql = sql + whereCond.join(' AND ');
            this.db.executeSql(sql, whereValues, function (rs) {
                console.log("updated");
                success(rs);
            }, function (error) {
                console.error('Update SQL statement ERROR: ' + error.message);
            });
        };
        this.insertData = function (data, table, success) {
            if (data.constructor === Array) {
                var self = this;
                var d = [];
                var valQues = [];
                var valFields = [];
                _.each(data, function (v) {
                    values = [];
                    _.each(v, function (val, field) {
                        valQues[valQues.length] = '?';
                        valFields[valFields.length] = field;
                        if (val != null && (val.constructor === Array || typeof val === 'object')) {
                            values[values.length] = JSON.stringify(val);
                        } else {
                            values[values.length] = val;
                        }
                    });
                    d[d.length] = ['INSERT INTO ' + table + '(' + valFields.join(",") + ') VALUES (' + valQues.join(", ") + ')', values];
                    valQues = [];
                    valFields = [];
                    values = [];
                });
                // this.alert(d);
                this.db.sqlBatch(d, function () {
                    console.log("inserted succesfully");
                    success(true);
                    // alert('inserted pol');
                }, function (error) {
                    console.log('SQL batch ERROR: ' + error.message);
                });
            } else {
                throw 'Invalid Argument';
            }
        }

        this.execute = function (success) {
            this.init();
            var self = this;
            if (_.isEmpty(this.tableKey)) {
                throw 'table not defined';
            }
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
                success(rs);
            }, function (error) {
                console.error('SELECT SQL statement ERROR: ' + error.message);
            });
            self.reset_query();
        }
    };
    return database;
});