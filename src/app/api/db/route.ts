import { connectToDatabase, createDatabase } from "src/lib/database/connection";
import { getUserModel } from "src/lib/database/models/User";
import { NextResponse as res} from "next/server";


export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const dbName = searchParams.get("dbName");
  
      if (!dbName) {
        return res.json({ success: false, message: "Database name is required" }, { status: 400 });
      }
  
      const connection = await connectToDatabase(dbName);
      if(connection ){
          return res.json({ success: true, message: `Connected to database: ${dbName}` });
      }
    } catch (error: any) {
      return res.json({ success: false, message: error.message }, { status: 500 });
    }
  }
  // 🚀 Handle POST Request

  export async function POST(req: Request) {
    try {
      const { action, dbName, user } = await req.json();
  
      if (!action) {
        return res.json({ success: false, message: "Missing action parameter" }, { status: 400 });
      }
  
      switch (action) {
        case "create-database":
          if (!dbName) {
            return res.json({ success: false, message: "Database name is required" }, { status: 400 });
          }
          await createDatabase(dbName);
          return res.json({ success: true, message: `Database '${dbName}' created successfully` });
  
        case "add-user":
          if (!dbName || !user) {
            return res.json({ success: false, message: "Database name and user data required" }, { status: 400 });
          }
          const connection = await connectToDatabase(dbName);
          const User = getUserModel(connection);
          await User.create(user);
          return res.json({ success: true, message: "User added successfully" });
  
        case "list-users":
          if (!dbName) {
            return res.json({ success: false, message: "Database name is required" }, { status: 400 });
          }
          const conn = await connectToDatabase(dbName);
          const UserModel = getUserModel(conn);
          const users = await UserModel.find();
          return res.json({ success: true, data: users });
  
        default:
          return res.json({ success: false, message: "Invalid action" }, { status: 400 });
      }
    } catch (error: any) {
      return res.json({ success: false, message: error.message }, { status: 500 });
    }
  }