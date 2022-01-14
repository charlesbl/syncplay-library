import express from "express";
import listAllFiles from "./listFiles";

const ADDRESS = process.env.ADDRESS || "localhost";
const PORT = Number.parseInt(process.env.PORT, 10) || 8080;
const SECRET = process.env.SECRET || "pass";
const ROOT_FOLDER = process.env.ROOT_FOLDER || "/files";

console.log(`ADDRESS: ${ADDRESS}`);
console.log(`PORT: ${PORT}`);
console.log(`SECRET: ${SECRET}`);
console.log(`ROOT_FOLDER: ${ROOT_FOLDER}`);

// Server
const app = express();

app.use((req, res, next) => {
    if (req.query.secret === SECRET) {
        next();
    } else {
        res.status(404).send('404');
    }
});

app.use("/ftp", express.static(ROOT_FOLDER));

app.get("/", (req, res) => {
    res.send(listAllFiles(ROOT_FOLDER, `http://${ADDRESS}:${PORT}/ftp`, SECRET));
});

const httpServer = app.listen(PORT, () => {
    console.log(`Server started at http://${ADDRESS}:${PORT}?secret=arz`);
});



const handleShutdownGracefully = () => {
    console.info("closing server gracefully...");
    httpServer.close(() => {
        console.info("server closed.");
        process.exit(0);
    });
}
process.on("SIGINT", handleShutdownGracefully);
process.on("SIGTERM", handleShutdownGracefully);
process.on("SIGHUP", handleShutdownGracefully);