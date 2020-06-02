const 	express 		= require("express"),
		bodyParser 		= require("body-parser"),
		methodOverride 	= require("method-override"),
	  	expressSanitizer= require("express-sanitizer"),
	  	mongoose 		= require("mongoose"),
		app 			= express();

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/Blog", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

//MONGOOSE MODEL CONFIG
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})
const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1530041539828-114de669390e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
// 	body: "Why you done this?"
// })

//RESTFUL ROUTES
app.get("/", function (req, res) {
	res.redirect("/blogs")
})

//CREATE Route
app.post("/blogs", function (req, res) {
	//sanitize input
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//create blogs
	Blog.create(req.body.blog, function (err, newBlog) {
		if (err) {
			res.render("new");
		} else {
	//then, redirect to the index
			res.redirect("/blogs");
		}
	});
})

app.get("/blogs/new", function (req, res) {
	res.render("new");
});

app.get("/blogs", function (req, res) {
	Blog.find({}, function (err, blogs) {
		if (err) {
			console.log("Error");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	})
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
	//sanitize input
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//update blog
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
})

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
});

app.listen(3000, function () {
	console.log("Server is running")
})