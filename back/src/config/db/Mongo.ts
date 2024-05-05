import mongoose from "mongoose";
import "dotenv/config";

class Mongo {
  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Mongo connected");
  }
}

// export default new Mongo();
export default Mongo;
