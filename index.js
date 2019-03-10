const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";

/// Action Creators
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  };
}
function addTodoToggleAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  };
}
function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  };
}
function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  };
}

function handleDeleteTodo(todo) {
  return dispatch => {
    dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id)
      .then(() => console.log("Todo deleted from server succcessfully"))
      .catch(() => {
        console.log("Error while removing todo from server.");
        dispatch(addTodoAction(todo));
        alert("an Error Occured");
      });
  };
}

function handleDeleteGoal(goal) {
  return dispatch => {
    dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id)
      .then(() => console.log("Goal deleted from server succcessfully"))
      .catch(() => {
        console.log("Error while removing goal from server.");
        dispatch(addGoalAction(goal));
        alert("an Error Occured");
      });
  };
}

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  };
}

function handleInitialData() {
  return dispatch => {
    return Promise.all([API.fetchTodos(), API.fetchGoals()])
      .then(([todos, goals]) => {
        dispatch(receiveDataAction(todos, goals));
      })
      .catch(e => console.log(e));
  };
}

function handleTodoToggle(todo) {
  return dispatch => {
    dispatch(addTodoToggleAction(todo.id));
    return API.saveTodoToggle(todo.id)
      .then(() => console.log("Toggled successfully from server"))
      .catch(e => {
        console.log("Error while toggling todo: ", e);
        dispatch(addTodoToggleAction(todo.id));
      });
  };
}

function handleAddTodo(name, onSuccess) {
  return dispatch => {
    return API.saveTodo(name)
      .then(todo => {
        onSuccess();
        dispatch(addTodoAction(todo));
      })
      .catch(e => {
        console.log("Error while adding todo at the server: ", e);
      });
  };
}

function handleAddGoal(name, onSuccess) {
  return dispatch => {
    return API.saveGoal(name)
      .then(goal => {
        onSuccess();
        dispatch(addGoalAction(goal));
      })
      .catch(e => console.log("Error while adding Goal at the server: ", e));
  };
}

//// Reducer functions are specific to business logic, therefore App's code.
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    case RECEIVE_DATA:
      return state.concat(action.todos);
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(aGoal => aGoal.id !== action.id);
    case RECEIVE_DATA:
      return state.concat(action.goals);
    default:
      return state;
  }
  return state;
}

//// Loading reducer
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

/// Middleware.
const checker = store => next => action => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("Nope. Buying Bitcoin is not a good idea at the moment");
  }
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("Nope. Buying Bitcoin is not a good idea at the moment");
  }
  return next(action);
};

const logger = store => next => action => {
  console.group(action.type);
  console.log("The action is:", action);
  const result = next(action);
  console.log("The new state is: ", store.getState());
  console.groupEnd();
  return result;
};

const thunk = store => next => action => {
  if (typeof action === "function") {
    return action(store.dispatch);
  }
  return next(action);
};

const middleWares = [ReduxThunk.default, logger, checker];

/// Creating the store and passsing the required reducer functions.
const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  Redux.applyMiddleware(...middleWares)
);

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}
