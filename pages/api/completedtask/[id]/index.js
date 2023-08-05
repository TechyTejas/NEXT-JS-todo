import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "PUT") {
        console.log(req)
        try {
          const { id} = req.query;
        const {data}= req.body;
        //   console.log("PUT", data, id);
    
          const client = await MongoClient.connect(
            "mongodb+srv://tejassadade645:tejas2001@cluster0.5ypnjt7.mongodb.net/todolist?retryWrites=true&w=majority"
          );
          const db = client.db();
    
          const meetupsCollection = db.collection("todolist");
          const result = await meetupsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { todo: data.todo, isCompleted: data.isCompleted } }
          );
          client.close();
    
          if (result.matchedCount > 0) {
            res.status(200).json({ message: "Update successful" });
          } else {
            res.status(404).json({ message: "Item not found" });
          }
        } catch (error) {
          console.log("Error:", error);
          res.status(500).json({ message: "Request failed" });
        }
      }else if (req.method === "DELETE") {
        console.log(req);
        try {
          const { id } = req.query;
        console.log("DELETE", id);
    
          const client = await MongoClient.connect(
            "mongodb+srv://tejassadade645:tejas2001@cluster0.5ypnjt7.mongodb.net/todolist?retryWrites=true&w=majority"
          );
          const db = client.db();
    
          const meetupsCollection = db.collection("todolist");
          const result = await meetupsCollection.deleteOne({
            _id: new ObjectId(id),
          });
          client.close();
    
          if (result.deletedCount > 0) {
            res.status(200).json({ message: "Delete successful" });
          } else {
            res.status(404).json({ message: "Item not found" });
          }
        } catch (error) {
          console.log("Error:", error);
          res.status(500).json({ message: "Request failed" });
        }
      } 
}