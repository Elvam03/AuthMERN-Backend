const mongoose = require("mongoose");
const Facility = require("./server").Facility;

mongoose.connect("your_mongodb_connection_string", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        await Facility.insertMany([
            { title: "Premium Care Clinic", location: "Nairobi", image: "/Images/hospital1.jpg", description: "Advanced treatments with top doctors." },
            { title: "Health First Medical", location: "Mombasa", image: "/Images/hospital2.jpg", description: "Your health, our priority." },
            { title: "Family Wellness Center", location: "Kisumu", image: "/Images/hospital3.jpg", description: "Comprehensive family health services." },
        ]);
        console.log("Database seeded!");
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
