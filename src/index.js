
import 'dotenv/config'
import connectDB from "./db/index.js";
connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {console.log(`server is running at port ${process.env.PORT}`)})
}).catch((err) => console.log(err));