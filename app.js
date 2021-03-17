if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const http = require('http')
const app = express();
const server = new http.createServer(app);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "public/views"))
app.use(express.static(path.join(__dirname, "public")));


const homeRouter = require('./src/routes/homeRoutes');

app.use('/', homeRouter)
// app.use('/play', playRouter)

app.get("/*", (req, res) => {
	res.status(404).render("home/404");
});

async function startServer(){
	server.listen(process.env.PORT, (error) => {
		if (error){
			console.log(error)
			return;
		}
		console.log("Server is ready!")
	})
}

startServer();