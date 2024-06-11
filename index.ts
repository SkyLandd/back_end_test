import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import router from "./router";

const app = express();
app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use(express.json());


app.listen(process.env.PORT, () => {
    console.log("app is listening on port 8000")
})

app.use("/", router());


 