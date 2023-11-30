import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Homepage() {
  // const [todo, setTodo] = useState("");
  const [todo, setTodo] = useState({
    task: "",       // Task title
    description: "", // Task description
    uidd: "" ,// Unique identifier
    optionValue:""   ,
    priority:"" ,
    enday:""    
  });
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      task: todo.task,
      description: todo.description,
      uidd: uidd,
      optionValue:todo.optionValue,
      priority:todo.priority,
      enday:todo.enday
    });

    setTodo({
      task: "",
      description: "",
      uidd: "",
      optionValue:"",
      priority:"",
      enday:""
    });
  };


  // update
  const handleUpdate = (task) => {
    setIsEdit(true);
    setTodo({
      task: task.task,
      description: task.description, // Set the description for the specific task
      uidd: task.uidd,
      optionValue:task.optionValue,
      priority:task.priority,
      enday:task.enday
    });
  };



  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd
    });

    setTodo("");
    setIsEdit(false);
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };
  const colorchanger=()=>{
    console.log("ok")
  }

  return (
    <div className="homepage">

      <div className="todo2">
        <input
          className="add-edit-input"
          type="text"
          placeholder="Add task..."
          value={todo.task}
          onChange={(e) => setTodo({ ...todo, task: e.target.value })}
        />
        <input
          className="add-edit-input"
          type="text"
          placeholder="Add description..."
          value={todo.description}
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        />
      </div>

      <div className="todo2">
        <div>
          <label htmlFor="" className="text-warning bg-dark priority">PRIORITY </label>
            <select className="option" value={todo.priority} onChange={(e) => setTodo({ ...todo, priority: e.target.value })}>
              <option value="Low" >Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
        </div>

        <input
          className="add-edit-input"
          type="date"
          value={todo.enday}
          onChange={(e) => setTodo({ ...todo, enday: e.target.value })}
        />
        <div className="select">
          <label htmlFor="" className="text-warning bg-dark priority">Completion status </label>
            <select className="option" value={todo.optionValue} onChange={(e) => setTodo({ ...todo, optionValue: e.target.value })}>
              <option value="No" >No</option>
              <option value="Yes">Yes</option>
            </select>
        </div>
         
        <AddIcon onClick={writeToDatabase} className="add-button" />
      </div>

      {todos.map((task) => (

        <div key={task.uidd} className={task.optionValue == 'Yes' ? 'yestodo' : 'notodo'}> 

          <div class="container">
            <div class="row">
                  <div class="col">  <h4>{task.priority}</h4></div>
                  <h4 class="col date">  <p>{task.optionValue == 'Yes' ? 'Completed' : `${task.enday}`}</p></h4>
            </div>
          </div>

          <div class="container">
            <div class="row">
              <div class="col"><h1>{task.task}</h1> </div>

              <div class="col">
                <EditIcon
                  fontSize="large"
                  onClick={() => {
                    handleUpdate(task);
                    handleDelete(task.uidd);
                  }}
                  className="edit-button"
                />
                <DeleteIcon
                  fontSize="large"
                  onClick={() => handleDelete(task.uidd)}
                  className="delete-button"
                />
                
                <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target={`#exampleModal-${task.description}`}> Desc </button>
              </div>
            </div>
          </div>

          <div className="modal fade" id={`exampleModal-${task.description}`}  data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  {task.description}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
            
        </div>
      ))}


        <button fontSize="large" onClick={handleSignOut} className="logout-icon">SIGN OUT</button>
    </div>
  );
}