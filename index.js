const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    let campgrounds = [
        {name: "Salmon Creek", image: "https://media.istockphoto.com/photos/motor-home-and-sunset-picture-id1321202626?b=1&k=20&m=1321202626&s=170667a&w=0&h=-Xggj1lySaS1HQvEXBTy2Ba4_rPUEyR3nt40les3ues="},
        {name: "Catalynk West", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"},
        {name: "Ebube Nnenna", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2FtcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"}
    ];

    res.render("campgrounds", {campgrounds: campgrounds});
})

app.listen(port, () => {
    console.log('Yelp Camp Server has started!');
})