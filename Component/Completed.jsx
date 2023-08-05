import React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./Completed.module.css";

export default function Completed() {
  const [data, setData] = useState([]);
  const todoRef = useRef();
  const [editingItemId, setEditingItemId] = useState(null);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/completedtask");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    const inputData = {
      todo: todoRef.current.value,
      isCompleted: true,
    };

    try {
      if (editingItemId) {
        // Perform PUT request for editing an item
        const response = await axios.put(`/api/completedtask/${editingItemId}`, {
          
          data: inputData,
        });
        console.log("Item updated successfully:", response.data);
        setEditingItemId(null); // Clear the editingItemId
      } else {
        // Perform POST request for adding a new item
        const response = await axios.post("/api/completedtask", inputData);
        console.log(response.data);
      }

      fetchData();
      todoRef.current.value = ""; // Clear the input field
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleCheckboxChange = async (id) => {
    try {
      const updatedData = data.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            isCompleted: !item.isCompleted,
          };
        }
        return item;
      });
      setData(updatedData);

      const updatedItem = updatedData.find((item) => item._id === id);

      const response = await axios.put("/api/completedtask", {
        id: id,
        data: updatedItem,
      });

      if (response.status === 200) {
        console.log("Item updated successfully:", response.data);
      } else {
        console.log("Error updating item:", response.status);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const navigateHandler = () => {
    router.push("/completedtask");
  };

  const deleteHandler = async (id) => {
    try {
      const response = await axios.delete(`/api/completedtask/${id}`);
      console.log(response.data);
      if (response.status === 200) {
        fetchData();
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const editbtnhandler = (id) => {
    const selectedItem = data.find((item) => item._id === id);
    if (selectedItem) {
      todoRef.current.value = selectedItem.todo;
      setEditingItemId(id);
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo List</h1>
      <div>
        <form onSubmit={submitHandler} className={styles.form}>
          <label className={styles.label}>Enter Todo </label>
          <input type="text" ref={todoRef} className={styles.input} />
          <button className={styles.button} type="submit">
            {editingItemId ? "Update " : "Add Todo"}
          </button>
        </form>
      </div>
      {data.length > 0 && (
        <ul className={styles.list}>
          {data.map((item, index) => (
            <li key={index} className={styles.item}>
              <input
                type="checkbox"
                checked={!item.isCompleted}
                onChange={() => handleCheckboxChange(item._id)}
              />
              <span className={styles.todo}>{item.todo}</span>

              <div className={styles.dataButtons}>
                <button
                  className={`${styles.dataButton} ${styles.dataButtonPrimary}`}
                  onClick={() => editbtnhandler(item._id)}
                >
                  Edit
                </button>
                <button
                  className={`${styles.dataButton} ${styles.dataButtonSecondary}`}
                  onClick={() => deleteHandler(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.navigate} onClick={navigateHandler}>
        See completed Task
      </button>
    </div>
  );
}
