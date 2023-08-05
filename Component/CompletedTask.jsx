
import  { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import axios from 'axios';
import classes from './CompletedTask.module.css'

export default function CompletedTask() {
    const router = useRouter();
  const [data,setData]=useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/completedtask");
      // console.log(response.data);
      setData(response.data.filter((item)=> !item.isCompleted));
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
  
  useEffect(() => {
   fetchData()
  }, []);

  const navigateHandler=()=>{
    router.push('/')
  }
  return (
    <div className={classes.container}>
        <h1 className={classes.heading}>Completed Task</h1>
      <ul className={classes.list}>{data.map((item,index)=>(
        <li className={classes.item} key={item._id}>{index+1}: {item.todo}</li>
      ))}</ul>
      <button className={classes.button} onClick={navigateHandler}>Visit Todo List</button>
    </div>
  )
}
