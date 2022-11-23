require("dotenv").config();
const aws = require("aws-sdk");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const Saved = require("./models/savedModal");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const client = require("twilio")(process.env.acountSID, process.env.authToken);
const app = express();
// const paymentRoute=require('./routes/paymentRoute.js')
const paymentRoute = require('./routes/paymentroutes.js')
const reviewRoute = require('./routes/reviewRoute')
const messageRoute = require('./routes/messageRoute')
// AWS.config.update({
//   accessKeyId: "AKIAR3UTLLOPFFCEOVXL",
//   secretAccessKey: "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",
// });
const s3 = new aws.S3({
  accessKeyId: "AKIAR3UTLLOPL3PE7AXG",
  secretAccessKey: "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",
  Bucket: "showcaseapp323",
  region: "us-east-1",
  signatureVersion: "v4",
});
// cors creadintial
app.use(express.json({
  origin:['http://localhost:3000','https://api.showcaseurbusiness.com'],
  credentials:true,
  optionSuccessStatus:200
}));
app.use(cookieParser(process.env.ACCESS_TOKEN_SECRET));
app.use(cors())

app.use(fileUpload({ useTempFiles: true }));
app.post('s3Url', async (req, res) => {
  const videoname = req.body.fn;
  const params = {
    Bucket: "showcaseapp23",
    Key: videoname,
    Expires: 60,

  };

  const uploadUrl = await s3.getSignedUrl("putObject", params);
  res.json({ uploadUrl, videoname });
})

// payment route 
app.use('/api/payment', paymentRoute)
// message route 
app.use('/api/message', messageRoute)


app.post("/user/saved", async (req, res) => {
  let { videoId, VideoLink, productId, latitude, longitude } = req.body;

  videoId = mongoose.Types.ObjectId(videoId);

  try {
    // here videoId -userid check if user exist or not
    let check = await Saved.exists({ videoId: videoId });

    if (check) {
      let data = await Saved.findOne({ videoId: videoId });
      let newLink = data.VideoLink;
      let already = newLink.includes(VideoLink);

      if (already) {
        res.json({ message: 0 });
      } else {
        newLink.push(VideoLink);
        await Saved.findOneAndUpdate(
          { videoId: videoId },
          { VideoLink: newLink }
        );
        res.json({ message: 1 });
      }
    } else {
      let saved = new Saved({
        videoId: videoId,
        VideoLink: VideoLink,
        productId,
        latitude,
        longitude,
      });

      await saved.save();
      res.json({ message: 1 });
    }
  } catch (err) {

    res.json({
      message: "Something went wrong",
    });
  }
});
app.get("/user/saved/:id", (req, res) => {
  let id = req.params.id;
  id = mongoose.Types.ObjectId(id);
  Saved.findOne({ videoId: id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {

      res.json({ message: "Something went wrong", err });
    });
});
app.delete("/user/delete/:id", (req, res) => {
  let id = req.params.id;
  id = mongoose.Types.ObjectId(id);
  User.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: "Account has been deleted successfully" });
    })
    .catch((err) => {
      console.log({ error: err, message: "Something went wrong" });
    });
});



app.patch("/updatePass", async (req, res) => {
  let { newpass, email } = req.body;
  newpass = await bcrypt.hash(newpass, 10);
  User.findOne({ email: email }).then((data) => {
    if (data) {
      data.password = newpass;
      data.save();
      res.json({ message: 1 });
    } else {
      res.json({ message: 0 });
    }
  });
});

// otp send api here
app.post("/onetimepassword", (req, res) => {
  let { country, phone } = req.body;

  client.verify
    .services(process.env.serviceID)
    .verifications.create({ to: `+${country}${phone}`, channel: "sms" })
    .then((verification) => {

      res.json({ message: "OTP sent successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Something went wrong" });
    });
});



/* serviceID = VAce3c11a44db0fb4e3f1c257f35e71c4f
acountSID = ACeda528334d03b1dbdab612410003f30d
authToken = 0fa2f3bb7636e7cbcf3d98bdc528f730 */


// otp check api 
app.post("/otpcheck", (req, res) => {
  let { otp, country, phone } = req.body;

  client.verify
    .services(process.env.serviceID)
    .verificationChecks.create({ to: `+${country}${phone}`, code: otp })
    .then((verification_check) => {
      res.json({
        message: "OTP verified successfully",
        data: verification_check.status,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Something went wrong" });
    });
});

// get all product with particular id
app.post("/fetchdetails", (req, res) => {
  const { email } = req.body;
  User.find({ email })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Something went wrong" });
    });
});
app.post("/exist", (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((data) => {
      if (data) {
        res.json({ message: "Email already exist", exist: 1 });
      } else {
        res.json({ message: "Email not exist", exist: 0 });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Something went wrong" });
    });
});




app.use("/user", require("./routes/userRoutes"));

app.use("/admin", require("./routes/proRoutes"));

app.use('/review', reviewRoute)



// Connect to mongodb

const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) throw err;
  console.log("Connected to mongoDB");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("server is running on port", PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");
//   socket.emit('msg', 'this is message')
//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })
// })

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    // console.log('userid',userId)
    // console.log('userid',socket.id)

    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log('data',data)
    // console.log(onlineUsers.get())
    const sendUserSocket = onlineUsers.get(data.to);
    // console.log('senduser',sendUserSocket)
    console.log('send message',data)
    if (sendUserSocket) {
      console.log('msg',data)
     socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
