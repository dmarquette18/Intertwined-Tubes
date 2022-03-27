let angle = [0,0];
let angleRate = 0.01;
let angle2 = [0,0];
let angleRate2 = 0.01
let radius = 100;
let tubeRadius = 25;
let radius2 = 100;
let tubeRadius2 = 25;
let increase = -1;

let sum;
let r = 200;
let g = 0;
let b = 0;
let avg;
let video;
let totalDiff;
let poseNet;
let pose;
let skeleton;
let prevRightX=0;
let prevLeftX=0;
let gotLandmark = false;
let doY = false;
let doX = false;
//Landmarks configured for my own camera
let landmark = [357,333];
const sentiment = ml5.sentiment('movieReviews');
let prediction;


function setup() {
  createCanvas(1000, 800, WEBGL);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video);
  
  poseNet.on('pose', gotPoses);
  myRec = new p5.SpeechRec('en-US'); // new P5.SpeechRec object
  myRec.continuous = true; // do continuous recognition
  myRec.interimResults = false
  myRec.onResult=parseResult;
  myRec.start();
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  let dx = 160 - width / 2;
  let dy = 105 - height / 2;
  let v = createVector(-1 * dx, -1 * dy, 0);
  v.div(100);
  ambientLight(r, 0, b);
  directionalLight(0, 200, b, v);
  pointLight(0, g, 150, 200, 0, 0);
  if(pose){
    if(pose.rightWrist.confidence > 0.80 && pose.leftWrist.confidence > 0.80){
      diffLeft = Math.abs(pose.leftWrist.x -landmark[0]);
      diffRight =  Math.abs(pose.rightWrist.x-landmark[0]);
      totalDiff =  Math.abs(pose.leftWrist.x-pose.rightWrist.x)
      radius = map(diffLeft, 0, 200, 10, 400, true)
      tubeRadius = map(diffLeft, 0, 200, 10, 50, true)
      radius2 = map(diffRight, 0, 200, 10, 400, true)
      tubeRadius2 =  map(diffRight, 0, 200, 10, 50, true)
      prevLeftX = pose.leftWrist.x
      prevRightX = pose.rightWrist.x
      angleRate = map(diffLeft, 0, 200, 0, 0.10, true)
      angleRate2 = map(diffRight, 0, 200, 0, 0.10, true)
    }
  }

  

  
  
  translate(0,0,0);
  noStroke();
  

  background(0);

  push();
  if(angleRate > 0.05){
    rotateY(angle[1])
  }
  rotateX(angle[0]);
  //rotateY(angle * 0.3);
  //rotateZ(angle);
  ambientMaterial(255);
  //fill(0, 0, 255);
  torus(radius, tubeRadius);
  pop();
  push();
  rotateY(angle2[1])
  if(angleRate2>0.05){
    rotateX(angle2[0])
  }
  torus(radius2, tubeRadius2);
  pop();
  angle[0] += angleRate;
  angle[1] += angleRate;
  angle2[0] += angleRate2;
  angle2[1] += angleRate2;

  //radius += (-1*increase)
  //tubeRadius = radius/2
  if(radius>136){
    increase *= -1
  }
  if(radius<50){
    increase *= -1
  }
  
  
}

  function parseResult(){
    mostrecentword = myRec.resultString;
    chunk = mostrecentword.split(" ")
    allSent = []
    for(i=0;i<chunk.length; i++){
      print(chunk[i])
      myWord = chunk[i].toUpperCase()
      print(myWord)
      try{
        allSent.push(sentiment.predict(myWord))

      }
      catch{
        print("No result for " + chunk[i])
      }
    }
    sum = 0
    allSent.forEach((item) => {
      sum += parseFloat(item['score'])
    });
    console.log(sum)
    console.log(allSent.length)
    avg = sum/allSent.length;
    console.log(avg)
    r = map(avg, 0.25, 0.75, 0, 255)
    g = map(avg, 0.25, 0.75, 100, 255)
    b = map(avg, 0.25, 0.75, 0, 100)
  
  }