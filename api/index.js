const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { List, Task, User, Currency, Messages } = require('./db/models');

const jwt = require('jsonwebtoken');

const CurrenciesHelper = require('./helpers/currencies');

const HyperLogLog = require('hyperloglog-lite');


/* MIDDLEWARE  */

// Load middleware
app.use(bodyParser.json());


// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;
        req.user_admin = user.admin;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/* END MIDDLEWARE  */




/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', authenticate, (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    const { freeText, taskTimeInput, category } = req.query
    const query = {
        _userId: req.user_id
    }
    if (freeText) {
        query.title = { $regex: freeText, $options: "i" }
    }
    if (taskTimeInput) {
        console.log(taskTimeInput, taskTimeInput.split('-'), taskTimeInput.split('-').map(unit => parseInt(unit)), new Date(...taskTimeInput.split('-').map(unit => parseInt(unit))))
        query.$where = `this.createdAt.toJSON().slice(0, 10) == "${taskTimeInput}"`
    }
    if (category) {
        query.category = category
    }

    List.find(query).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', authenticate, (req, res) => {
    // We want to create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
    let title = req.body.title;
    let category = req.body.category;
    let newList = new List({
        title,
        category,
        _userId: req.user_id
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (incl. id)
        res.send(listDoc);
    })
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', authenticate, (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully' });
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', authenticate, (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    List.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
});


/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:listId/tasks', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    const { listId } = req.params
    const { freeText, taskTimeInput, onlyPending } = req.query
    const query = {
        _listId: listId,
    }
    if (freeText) {
        query.title = { $regex: freeText, $options: "i" }
    }
    if (taskTimeInput) {
        query.time = taskTimeInput
    }
    if (onlyPending === 'true') {
        query.completed = !onlyPending
    }
    Task.find(query).then((tasks) => {
        res.send(tasks);
    })
});


/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post('/lists/:listId/tasks', authenticate, (req, res) => {
    // We want to create a new task in a list specified by listId

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                title: req.body.title,
                time: req.body.time,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    // We want to update an existing task (specified by taskId)

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // the currently authenticated user can update tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                $set: req.body
            }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canDeleteTasks) => {

        if (canDeleteTasks) {
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
});



/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    body.isConnected = true;
    let newUser = new User(body);


    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
        getNumOfUsers();
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;


    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
            getNumOfUsers();
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})
/**
 * GET /brunches-locations
 * Purpose: Get all brunches locations for showing on map
 */
app.get('/tasks-summary', authenticate, (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    List.find({
        _userId: req.user_id
    }).then((lists) => {
        const listMap = {};
        lists.forEach(list => {
            if(!listMap[list._id]) {
                listMap[list._id] = { count: 0, title: list.title };
            }
        })
        Task.find({
            '_listId': { $in: Object.keys(listMap) }
        }, function(err, tasks){
            tasks.forEach(task => {
                listMap[task._listId].count += 1
            })
            res.send(Object.values(listMap));
        });
    })
});



//Get  all the Users
app.get('/users', authenticate, (req, res) => {
    User.find({

    }).then((users) => {
        res.send(users);
    }
    )
})
//delete user
app.delete('/users/:id', authenticate, (req, res) => {
    // We want to delete the specifiedt id (document with id in the URL)
    User.findOneAndRemove({
        _id: req.params.id,
    }).then((removedUserDoc) => {
        res.send(removedUsertDoc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});
//edit user
app.patch('/users/:id/', authenticate, (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully' });
        getNumOfUsers();

    });

});
//count the user that connected
app.get('/users/count', authenticate, (req, res) => {
    User.aggregate(
        [
            {
                $match: { isConnected: true }
            },
            {
                $count: 'connected'
            }
        ]
    ).then((count) => {
        res.send(count);
    }
    )

});
//group by
app.get('/usersByCities', authenticate, (req, res) => {
    User.aggregate([
        { '$group': { 
            '_id': '$city' , 
            'total': { '$sum': 1 } 
        } },
        { '$sort': { 'total': -1 } } 
    ], function(err, results) {
        console.log(results);
        res.json(results);
    });
})
//map-reduce
app.get('/listCategoriesByUsers', authenticate, (req, res) => {

    var o = {};
    o.map = function () {
        emit(this.category, 1)
    };
    o.reduce = function (k, vals) {
        return vals.length
    };

    List.mapReduce(o, function (err, results) {
        if(err) throw err;
        console.log(results)
        res.json(results.results);
    });
});
//scarper
app.get('/currencies', authenticate, (req, res) => {
    Currency.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => console.dir(err));
});

/* HELPER METHODS */
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tasks from " + _listId + " were deleted!");
    })
}
let getNumOfUsers = () => {
    User.aggregate(
        [
            {
                $match: { isConnected: true }
            },
            {
                $count: 'connected'
            }
        ]
    ).then((count) => {
        io.sockets.emit('event', count);
        console.log(count);
    }
    )
}
//socket
/*io.on('connection',function(socket)
{
console.log("User connected")
socket.emit();
});*/



//START CURRENCIES WEB SCRAPPER
const checkForCurrencies = () => {
    Currency.find()
        .then(res => {
            if (res.length = 0) {
                CurrenciesHelper.getData();
            }
        })
        .catch(err => {
            if (err.code === 26) {
                CurrenciesHelper.getData();
            } else {
                console.log(err);
            }
        });
}
const getNewCurrencies = () => {
    mongoose.connection.dropCollection('currencies', ((err, res) => {
        if (res) return CurrenciesHelper.getData();
        if (err.code === 26) {
            CurrenciesHelper.getData();
        } else {
            console.log(err);
        }
    }));
}
CurrenciesHelper.getData();
//checkForCurrencies();
//END CURRENCIES WEB SCRAPPER


//MessagesSchema
//get all messages
app.get('/messages', authenticate, (req, res) => {
    Messages.find({
    }).then((messages) => {
        res.send(messages);
    }
    ).catch((e) => {
        res.send(e);
    });
})

// Count distinct words in messages
app.get('/numDistinctWordsInMessages', authenticate, (req, res) => {
    const hll = HyperLogLog(12);
    Messages.find({
    }).then((messages) => {
        for(let msg of messages) {
          const words = msg.title.split(" ");
          for(let word of words) {
            hll.add(HyperLogLog.hash(word));
          }
        }
        const numDistinctWordsObj  = { "numDistinctWords" : hll.count() }
        console.log(numDistinctWordsObj);
        res.send(numDistinctWordsObj);
    }
    ).catch((e) => {
        res.send(e);
    });
})

//delete message
app.delete('/messages/:id', authenticate, (req, res) => {
    // We want to delete the specifiedt id (document with id in the URL)
    Messages.findOneAndRemove({
        _id: req.params.id,
    }).then((removedMessageDoc) => {
        res.send(removedMessagetDoc);
        io.sockets.emit('message', 'MessageUpdate');
    }).catch((e) => {
        res.status(400).send(e);
        io.sockets.emit('message', 'MessageUpdate');
    });
});


//post
app.post('/message', authenticate, (req, res) => {

    let newMessage = new Messages({
        title: req.body.title,
    });
    newMessage.save().then((newMessageDoc) => {
        res.send(newMessageDoc);
        io.sockets.emit('message', 'MessageUpdate');
    })

});


//edit message
app.patch('/messages/:id/', authenticate, (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    Messages.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully' });
        io.sockets.emit('message', 'MessageUpdate');

    });

});






server.listen(3100, () => {
    console.log("Socket is listening on port 3100");
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})
