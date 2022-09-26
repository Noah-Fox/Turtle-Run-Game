//PUBLIC VERSION -- DO NOT EDIT
//open in broweser, large screen display

//notice -- two awards were added after making all game-save functions. The bugs caused by this should be fixed
//However, there are now 22 awards, and the save code is 9 letters, insted of 20 and 8, respectively. Disregard any comments that say otherwise

//there is still the potential bug, that the code input by the player does not get checked before changing the award values

var screenSize = 600;

//game has a save function, which gives the player an 8-letter code which contains the values of each award they have (locked,unlocked,or won).
//these values are converted into 20 base-3 values, then to 7 base-26 values, using only letters. An eight letter is added, and the value of that letter is added to each letter (a = +1...);
var encodedBase = 26;
var saveCode = "";
var enteredCode = [];
var enteredCodeString = "";

//awards array contains Award objects
var awards = [];
var awardOn = 0;//which award is currently selected in awards menu
var newAward = false;//an award has just been won, and a notification bubble is on the button for the award menu
var newAwardBubbleSize = 15;//size of notification bubble
var winAmount = 0;//total amount of games the player has won
var loseAmount = 0;//total amount of games the player has lost
var escapeAmount = 0;//amount of times the player has escaped bees. resets at beginning of game
var chaseBeganAt = -1;//records time that bees began chasing player
var amountOnRoad = 0;//increases for every frame that the player is on a road
var amountOffRoad = 0;//increases for every fram that the player is not on a road
var justWon = true;//player has just won a game

var turtleX = 0;
var turtleY = 0;
var turtleAngle = 0;
var turtleSpeed = 5;//max speed when off roads
var roadSpeed = 7;//max speed when on roads
var rocketSpeed = 10;//max speed with rockets
var turtleTwist = 3;//speed that the turtle rotates
var laserAmount = 5;//amount of lasers that can be shot with one laser gun
var lasersLeft = 0;//amount of lasers that can still be shot

var rocketTime = 500;//max amount of time a rocket can be on
var rocketLeft = 0;//amount of time a rocket has left

var turtleVelocity = 0;//current velocity of player
var turtleAcceleration = 0.2;//amount turtle accelerates, regardless of road/rocket status
var turtleFriction = 0.3;//friction applied to velocity, regardless of road/rocket status
var turnFriction = 0.25;//friction applied to velocity when turning

var maxDist = 3000;//distance from center when grass startes turning brown



var crownX = 0;
var crownY = 0;

var compasses = [];//[x-position,y-position,number determining how fast it wiggles]
var compassAmount = 60;
var compassWiggle = 30;

var beehives = [];//[x-position,y-position,boolean for whether it still has bees]
var beehiveAmount = 30;
var beehiveRadius = 150;//distance from a beehive when bees attack player
var beehiveSparkleAmount = 50;//amount of sparkles released when a beehive dies

var bees = [];//[x-position,y-position]
var beeAmount = 10;
var beeSpeed = turtleSpeed+0.5;

var lasers = [];//[x-position,y-position,angle]
var laserLength = 10;
var laserSpeed = 8;//speed of a laser relative to player (added to velocity of the player)

var laserGuns = [];//[x-position,y-position]
var laserGunAmount = 25;

var rocketGifts = [];//[x-position,y-position]
var rocketGiftAmount = 25;

var verticalRoads = [];//x-position
var horizontalRoads = [];//y-position
var roadAmount = 10;
var roadWidth = 60;
var roadDashWidth = 10;
var roadDashLength = 30;
var onRoad = false;

var sparkles = [];//contains Sparkle Objects

var pressing = false;
var clicking = false;

var nextTownOver = [0,0];
var nextTownDist = 15000;
var townSignSize = 200;

//boolean values for which menu is currently being viewed
var onGame = false;
var onMainMenu = true;
var onAwards = false;
var onInstructions = false;
var onWinPage = false;
var onLosePage = false;
var onSavePage = false;
var onLoadPage = false;

//fonts for certain situations
var mainMenuFont;
var buttonFont;
var instructionsFont;
var winFont;
var loseFont;
var saveCodeFont;

//arrays containing Button objects, used in certain situations
var mainMenuButtons = [];
var instructionsButtons = [];
var winButtons = [];
var awardButtons = [];
var savePageButtons = [];

function preload(){
  mainMenuFont = loadFont("Sweet Cherry Free.otf");
  instructionsFont = loadFont("Maybe Yes.otf");
  buttonFont = loadFont("Chocolate Dipped Strawberry.ttf");
  winFont = loadFont("Chicken Dinner Font.otf");
  loseFont = loadFont("Fondacy Carved.otf");
  saveCodeFont = loadFont("LEMONMILK-Regular.otf");
}

function setup() {
  createCanvas(screenSize, screenSize);
  rectMode(CENTER);
  angleMode(DEGREES);
  
  append(awards,new Award("Prince of the pond","Get the crown once",true));
  append(awards,new Award("King of the lake","Get the crown ten times",false));
  append(awards,new Award("Emperor of the oceans","Get the crown thirty times",false));
  append(awards,new Award("Flesh wound","Die once",true));
  append(awards,new Award("Bee food","Die ten times",false));
  append(awards,new Award("World's worst beekeeper","Die thirty times",false));
  append(awards,new Award("Near-death experience","Escape from a swarm of bees",true));
  append(awards,new Award("Tempting fate","Escape from a swarm of bees three times in one game",false));
  append(awards,new Award("Master of escape","Escape from a swarm of bees ten times in one game",false));
  append(awards,new Award("First blood","Kill your first beehive",true));
  append(awards,new Award("Honey badger","Kill ten beehives in one game",false));
  append(awards,new Award("Lord of the bees","Kill twenty beehives in one game",false));
  append(awards,new Award("Extinction","Kill all thirty beehives in one game",false));
  append(awards,new Award("Laser hoarder","Collect all " + laserGunAmount + " laser guns",true));
  append(awards,new Award("Rocket hoarder","Collect all " + rocketGiftAmount + " rockets",true));
  append(awards,new Award("High speed chase","Keep a swarm of bees in pursuit for ten seconds",true));
  append(awards,new Award("Cross country chase","Keep a swarm of bees in pursuit for thirty seconds",false));
  append(awards,new Award("Angry mob","Get chased by five swarms of bees at once",true));
  append(awards,new Award("Road hater","Win after spending 95% of a game off roads",true));
  append(awards,new Award("Road lover","Win after spending 95% of a game on roads",false));
  append(awards,new Award("Way to use your head","Kill a beehive without using a laser gun",true));
  append(awards,new Award("Vacation","This same old town gets boring after a while...",true));
  
  
  append(mainMenuButtons,new Button(0.5*screenSize,0.6*screenSize,"Play",130,50,30));
  append(mainMenuButtons,new Button(0.35*screenSize,0.75*screenSize,"Awards",130,50,30));
  append(mainMenuButtons,new Button(0.65*screenSize,0.75*screenSize,"Instructions",130,50,30));
  append(mainMenuButtons,new Button(0.35*screenSize,0.9*screenSize,"Save Game",130,50,30));
  append(mainMenuButtons,new Button(0.65*screenSize,0.9*screenSize,"Load Game",130,50,30));
  
  append(instructionsButtons,new Button(0.5*screenSize,0.85*screenSize,"Menu",130,50,30));
  
  append(winButtons,new Button(0.5*screenSize,0.6*screenSize,"Play Again",130,50,30));
  append(winButtons,new Button(0.5*screenSize,0.75*screenSize,"Awards",130,50,30));
  append(winButtons,new Button(0.5*screenSize,0.9*screenSize,"Menu",130,50,30));
  
  append(awardButtons,new Button(0.75*screenSize,0.82*screenSize,"Menu",130,50,30));
  append(awardButtons,new Button(0.75*screenSize,0.94*screenSize,"Play",130,50,30));
  
  append(savePageButtons,new Button(0.8*screenSize,0.9*screenSize,"Menu",130,50,30));
}

function draw() {
  if (onMainMenu){
    background(0,255,150);
    drawStandingTurtle(0.4*screenSize,0.25*screenSize,40);
    drawCrown(0.6*screenSize,0.25*screenSize,40);
    push();
    textFont(mainMenuFont,50);
    textAlign(CENTER,CENTER);
    text("Turtle Run",0.5*screenSize,0.4*screenSize);
    
    //play
    if (mainMenuButtons[0].runButton()){
      onMainMenu = false;
      onGame = true;
      createGame();
    }
    //awards
    if (mainMenuButtons[1].runButton()){
      onMainMenu = false;
      onAwards = true;
    }
    //instructions
    if (mainMenuButtons[2].runButton()){
      onMainMenu = false;
      onInstructions = true;
    }
    //save game
    if (mainMenuButtons[3].runButton()){
      onMainMenu = false;
      onSavePage = true;
      var newCode = encodeSaveData();
      saveCode = "";
      for (let i = 0; i < newCode.length; i ++){
        saveCode += newCode[i].toUpperCase();
      }
    }
    //load game
    if (mainMenuButtons[4].runButton()){
      onMainMenu = false;
      onLoadPage = true;
      enteredCode = [];
      enteredCodeString = "";
    }
    if (newAward){
      mainMenuButtons[1].notification();
    }
    pop();
  }
  else if (onInstructions){
    push();
    background(0,200,200);
    textFont(instructionsFont,50);
    textAlign(LEFT,TOP);
    text("Turtle Run",20,20);
    textSize(25);
    text("Follow the compasses to get the crown\n\nAvoid beehives\n\nCollect laser guns and rockets\n\nPress space to shoot lasers at beehives\n\nDo cool stuff to win awards\n\nUse up/down arrows and W/S keys to navigate awards",20,100);
    
    //main menu
    if (instructionsButtons[0].runButton()){
      onInstructions = false;
      onMainMenu = true;
    }
    pop();
  }
  else if (onWinPage){
    //displayed after winning a game
    background(0,255,200);
    push();
    textFont(winFont,40);
    textAlign(CENTER,CENTER);
    drawStandingTurtle(0.5*screenSize,0.25*screenSize,40);
    drawCrown(0.5*screenSize,0.25*screenSize-30,30);
    text("You got the crown!",0.5*screenSize,0.4*screenSize);
    pop();
    
    //play
    if (winButtons[0].runButton()){
      onWinPage = false;
      onGame = true;
      createGame();
    }
    //awards
    else if (winButtons[1].runButton()){
      onWinPage = false;
      onAwards = true;
    }
    //main menu
    else if (winButtons[2].runButton()){
      onMainMenu = true;
      onWinPage = false;
    }
    if (newAward){
      winButtons[1].notification();
    }
  }
  else if (onLosePage){
    //displayed after losing a game
    background(0,100,100);
    push();
    textFont(loseFont,40);
    textAlign(CENTER,CENTER);
    text("You died...",0.5*screenSize,0.4*screenSize);
    drawUpsideDownTurtle(0.5*screenSize,0.25*screenSize,40);
    
    //play
    if (winButtons[0].runButton()){
      onLosePage = false;
      onGame = true;
      createGame();
    }
    //awards
    else if (winButtons[1].runButton()){
      onLosePage = false;
      onAwards = true;
    }
    //main menu
    else if (winButtons[2].runButton()){
      onLosePage = false;
      onMainMenu = true;
    }
    if (newAward){
      winButtons[1].notification();
    }
    pop();
  }
  else if (onAwards){
    //shows each award, gray and with a lock if locked, white if unlocked, yellow if won
    background(0,255,255);
    newAward = false;
    
    push();
    var awardBoxHeight = 40;
    var awardBoxWidth = 300;
    strokeWeight(3);
    textFont(winFont,20);
    noFill();
    rect(0.3*screenSize,0.5*screenSize,awardBoxWidth+10,awardBoxHeight+10);
    line(0.3*screenSize+0.5*awardBoxWidth+5,0.5*screenSize,0.75*screenSize-100,0.5*screenSize);
    rect(0.75*screenSize,0.5*screenSize,200,300);
    fill(255);
    rect(0.75*screenSize,0.5*screenSize,190,290);
    fill(0);
    textAlign(LEFT,TOP);
    //if the center/selected award is unlocked or won, the display box shows its title and description
    //if it is locked, the display box shows its title and question marks
    if (awards[awardOn].isUnlocked){
      text(awards[awardOn].title+"\n\n"+awards[awardOn].description,0.75*screenSize,0.5*screenSize,180,280);
    }else{
      text(awards[awardOn].title+"\n\n?????????????????????? ??????????????????????",0.75*screenSize,0.5*screenSize,180,280);
    }
    textAlign(LEFT,CENTER);
    var makeAward = awardOn;
    //going through each award and showing its box
    for (let i = 0; i < awards.length; i ++){
      if (!awards[i].isUnlocked){
        fill(160);
      }
      else if (awards[i].hasWon){
        fill(255,255,0);
      }
      else{
        fill(255);
      }
      //clicking an award selects it
      if (!clicking && mouseIsPressed && abs(mouseX-(0.3*screenSize)) < 0.5*awardBoxWidth && abs(mouseY-(0.5*screenSize+(i-awardOn)*1.5*awardBoxHeight)) < 0.5*awardBoxHeight){
        clicking = true;
        makeAward = i;
      }
      rect(0.3*screenSize,0.5*screenSize+(i-awardOn)*1.5*awardBoxHeight,awardBoxWidth,awardBoxHeight);
      fill(0);
      text(awards[i].title,0.3*screenSize-0.45*awardBoxWidth,0.5*screenSize+(i-awardOn)*1.5*awardBoxHeight);
      if (!awards[i].isUnlocked){
        drawLock(0.3*screenSize+0.5*awardBoxWidth-20,0.5*screenSize+(i-awardOn)*1.5*awardBoxHeight,20,false);
      }else if (awards[i].justUnlocked){
        drawLock(0.3*screenSize+0.5*awardBoxWidth-20,0.5*screenSize+(i-awardOn)*1.5*awardBoxHeight,20,true);
      }
      if (awards[i].justWonAward){
        fill(255,0,0);
        circle(0.3*screenSize+0.5*awardBoxWidth,0.5*screenSize+(i-awardOn)*1.5*awardBoxHeight-0.5*awardBoxHeight,newAwardBubbleSize);
      }
    }
    if (makeAward != awardOn){
      awardOn = makeAward;
    }
    if (clicking && !mouseIsPressed){
      clicking = false;
    }
    pop();
    
    //up and down arrows move selects award above and below selected one
    //W and S keys selects first award above and below selected one that has been won
    if (keyIsDown(UP_ARROW)){
      if (!pressing && awardOn > 0){
        pressing = true;
        awardOn --;
      }
    }
    else if(keyIsDown(DOWN_ARROW)){
      if (!pressing && awardOn < awards.length-1){
        pressing = true;
        awardOn ++;
      }
    }
    else if (keyIsDown(87)){
      if (!pressing){
        pressing = true;
        let makeAward = awardOn;
        for (let i = 0; i < awardOn; i ++){
          if (awards[i].hasWon){
            makeAward = i;
          }
        }
        awardOn = makeAward;
      }
    }
    else if (keyIsDown(83)){
      if (!pressing){
        pressing = true;
        let makeAward = awardOn;
        for (let i = awards.length-1; i > awardOn; i --){
          if (awards[i].hasWon){
            makeAward = i;
          }
        }
        awardOn = makeAward;
      }
    }
    else if (pressing){
      pressing = false;
    }
    
    //main menu
    if (awardButtons[0].runButton()){
      onAwards = false;
      onMainMenu = true;
    }
    //play
    if (awardButtons[1].runButton()){
      onAwards = false;
      onGame = true;
      createGame();
    }
    //after the awards page has been exited, it gets rid of any notifications of new awards
    if (!onAwards){
      for (let i = 0; i < awards.length; i ++){
        if (awards[i].justWonAward){
          awards[i].justWonAward = false;
        }
        if (awards[i].justUnlocked){
          awards[i].justUnlocked = false;
        }
      }
    }
  }
  else if (onSavePage){
    //displays 8-letter save code for the game
    background(0,255,210);
    push();
    textFont(instructionsFont,30);
    textAlign(CENTER,TOP);
    text("Enter this 9-letter code into the\nLoad Game menu to recover your progress",0.5*screenSize,40);
    strokeWeight(3);
    fill(150,150,255);
    rect(0.5*screenSize,0.5*screenSize,200,80);
    textFont(saveCodeFont,30);
    textAlign(CENTER,CENTER);
    fill(0);
    text(saveCode,0.5*screenSize,0.5*screenSize);
    
    //main menu
    if (savePageButtons[0].runButton()){
      onSavePage = false;
      onMainMenu = true;
    }
    pop();
  }
  else if (onLoadPage){
    //displays empty box, where letters can be typed into
    background(0,255,210);
    push();
    textFont(instructionsFont,30);
    textAlign(CENTER,TOP);
    text("Enter your 9-letter code\nPress Enter to submit",0.5*screenSize,40);
    
    strokeWeight(3);
    fill(150,150,255);
    rect(0.5*screenSize,0.5*screenSize,200,80);
    fill(0);
    textFont(saveCodeFont,30);
    textAlign(CENTER,CENTER);
    text(enteredCodeString,0.5*screenSize,0.5*screenSize);
    
    var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n", "o","p","q","r","s","t","u","v","w","x","y","z"];
    //Enter submits code and sets award to loaded information
    if (keyIsDown(ENTER)){
      if (!pressing && enteredCode.length == 9){
        pressing = true;
        getSaveData(enteredCode);
        enteredCode = [];
        enteredCodeString = "";
      }
    }
    else if (keyIsDown(keyCode)){
      if (!pressing){
        pressing = true;
        //pressing backspace gets rid of last letter
        if (keyCode == 8 && enteredCode.length > 0){
          enteredCode.splice(enteredCode.length-1,1);
          enteredCodeString = "";
          for (let i = 0; i < enteredCode.length; i ++){
            enteredCodeString += enteredCode[i].toUpperCase();
          }
        }else if (keyCode >= 65 && enteredCode.length < 9){
          append(enteredCode,letters[keyCode-65]);
          enteredCodeString += letters[keyCode-65].toUpperCase();
        }
      }
    }else if (pressing){
      pressing = false;
    }
    
    //main menu
    if (savePageButtons[0].runButton()){
      onLoadPage = false;
      onMainMenu = true;
    }
    pop();
  }
  else if (onGame){
    //determining color of the ground based on distance from center (green to brown)
    var turtleDist = getDistance(turtleX,turtleY,0,0);
    var fullChange = 5000;
    if (turtleDist < maxDist){
      background(100,255,100);
    }
    else{
      var outAmount = (turtleDist-maxDist)/fullChange;
      if (outAmount > 1){
        outAmount = 1;
      }
      background(outAmount*171+(1-outAmount)*100,outAmount*126+(1-outAmount)*255,outAmount*50+(1-outAmount)*100);
    }
    if (turtleDist > nextTownDist && nextTownOver[0] == 0 && nextTownOver[1] == 0){
      nextTownOver[0] = turtleX + screenSize*cos(turtleAngle);
      nextTownOver[1] = turtleY + screenSize*sin(turtleAngle);
    }
    
    onRoad = false;
    //drawing roads
    for (let i = 0; i < roadAmount; i ++){
      push();
      fill(100);
      noStroke();
      if (abs(turtleY-horizontalRoads[i]) < 0.5*(screenSize+roadWidth)){
        rect(0.5*screenSize,horizontalRoads[i]-turtleY+0.5*screenSize,screenSize,roadWidth);
        if (abs(turtleY-horizontalRoads[i]) < 0.5*(roadWidth)){
          onRoad = true;
        }
      }
      if (abs(turtleX-verticalRoads[i]) < 0.5*(screenSize+roadWidth)){
        rect(verticalRoads[i]-turtleX+0.5*screenSize,0.5*screenSize,roadWidth,screenSize);
        if (abs(turtleX-verticalRoads[i]) < 0.5*(roadWidth)){
          onRoad = true;
        }
      }
      pop();
    }
    //recording if player is on road or not
    if (awards[18].canGet() || awards[19].canGet()){
      if (onRoad){
        amountOnRoad ++;
      }else{
        amountOffRoad ++;
      }
    }
    push();
    fill(255);
    noStroke();
    //putting dashes on roads
    for (let i = 0; i < roadAmount; i ++){ 
      if (abs(turtleY-horizontalRoads[i]) < 0.5*(screenSize+roadWidth)){
        for (let x = 0; x < 6 + 2*screenSize/roadDashLength; x ++){
          rect(2*(x-1)*roadDashLength-turtleX%(2*roadDashLength),horizontalRoads[i]-turtleY+0.5*screenSize,roadDashLength,roadDashWidth);
        }
      }
      if (abs(turtleX-verticalRoads[i]) < 0.5*(screenSize+roadWidth)){
        for (let x = 0; x < 6 + 2*screenSize/roadDashLength; x ++){
          rect(verticalRoads[i]-turtleX+0.5*screenSize,2*(x-1)*roadDashLength-turtleY%(2*roadDashLength),roadDashWidth,roadDashLength);
        }
      }
    }
    pop();
    
    push();
    fill(100);
    noStroke();
    //making intersections empty
    for (let i = 0; i < horizontalRoads.length; i ++){
      if (abs(turtleY-horizontalRoads[i]) < 0.5*(screenSize+roadWidth)){
        for (let x = 0; x < verticalRoads.length; x ++){
          if (abs(turtleX-verticalRoads[x]) < 0.5*(screenSize+roadWidth)){
            square(verticalRoads[x]-turtleX+0.5*screenSize,horizontalRoads[i]-turtleY+0.5*screenSize,roadWidth);
          }
        }
      }
    }
    pop();
    
    //making sign for next town over
    if (turtleDist > maxDist && abs(nextTownOver[0]-turtleX) < 0.5*(screenSize+townSignSize) && abs(nextTownOver[1]-turtleY) < 0.5*(screenSize+townSignSize)){
      if (awards[21].canGet()){
        awards[21].win();
        newAward = true;
      }
      push();
      fill(230,180,30);
      strokeWeight(3);
      square(nextTownOver[0]-turtleX+0.5*screenSize,nextTownOver[1]-turtleY+0.5*screenSize,townSignSize);
      fill(0);
      textFont(buttonFont,20);
      textAlign(LEFT,TOP);
      text("Welcome to:\nThe Next Town Over\n\nPopulation: you",nextTownOver[0]-turtleX+0.5*screenSize-0.4*townSignSize,nextTownOver[1]-turtleY+0.5*screenSize-0.4*townSignSize);
      pop();
    }
    
    //drawing beehives
    for (let i = beehives.length-1; i >= 0; i --){
      //if it sent its bees out, and there are no bees following player, it gets its bees back
      if (!beehives[i][2] && bees.length == 0){
        beehives[i][2] = true;
      }
      //if it's on screen
      if (abs(beehives[i][0]-turtleX) < 0.5*(screenSize+30) && abs(beehives[i][1]-turtleY) < 0.5*(screenSize+30)){
        drawHive(beehives[i][0]-turtleX+0.5*screenSize,beehives[i][1]-turtleY+0.5*screenSize,30);
        //if it has bees and player is in range
        if (getDistance(beehives[i][0],beehives[i][1],turtleX,turtleY) < beehiveRadius && beehives[i][2]){
          if (bees.length == 0){
            chaseBeganAt = millis();
          }
          append(bees,[beehives[i][0],beehives[i][1]]);
          beehives[i][2] = false;
        }
        var isHit = false;
        //player can kill it by touching it or by shooting it
        if (getDistance(turtleX,turtleY,beehives[i][0],beehives[i][1]) < 35){
          isHit = true;
          if (awards[20].canGet()){
            awards[20].win();
            newAward = true;
          }
        }
        for (let x = lasers.length-1; x >= 0; x --){
          if (getDistance(lasers[x][0]+0.5*laserLength*cos(lasers[x][2]),lasers[x][1]+0.5*laserLength*sin(lasers[x][2]),beehives[i][0],beehives[i][1]) < 15){
            isHit = true;
            lasers.splice(x,1);
          }
        }
        if (isHit){
          for (let x = 0; x < beehiveSparkleAmount; x ++){
            var sparkleAngle = random(0,360);
            var startDist = random(0,20);
            append(sparkles, new Sparkle(beehives[i][0]+startDist*cos(sparkleAngle),beehives[i][1]+startDist*sin(sparkleAngle),
                                         random(150,200),random(100,150),0,
                                         sparkleAngle,random(1.5,2.5),
                                         5,random(30,50)));
          }
          beehives.splice(i,1);
        }
      }
    }
    
    //drawing laser gun gifts
    for (let i = laserGuns.length-1; i >= 0; i --){
      if (abs(laserGuns[i][0]-turtleX) < 0.5*(screenSize+40) && abs(laserGuns[i][1]-turtleY) < 0.5*(screenSize+40)){
        drawLaserGunGift(laserGuns[i][0]-turtleX+0.5*screenSize,laserGuns[i][1]-turtleY+0.5*screenSize,40);
        
        if (getDistance(laserGuns[i][0],laserGuns[i][1],turtleX,turtleY) < 40){
          laserGuns.splice(i,1);
          lasersLeft += laserAmount;
        }
      }
    }
    
    //drawing rocket gifts
    for (let i = rocketGifts.length-1; i >= 0; i --){
      if (abs(rocketGifts[i][0]-turtleX) < 0.5*(screenSize+40) && abs(rocketGifts[i][1]-turtleY) < 0.5*(screenSize+40)){
        drawRocketGift(rocketGifts[i][0]-turtleX+0.5*screenSize,rocketGifts[i][1]-turtleY+0.5*screenSize,40);
        
        if (getDistance(rocketGifts[i][0],rocketGifts[i][1],turtleX,turtleY) < 40){
          rocketGifts.splice(i,1);
          rocketLeft += rocketTime;
        }
      }
    }
    
    //drawing crown, ending game if it gets got
    drawCrown(crownX-turtleX+0.5*screenSize,crownY-turtleY+0.5*screenSize,40);
    if (getDistance(crownX,crownY,turtleX,turtleY) < 40){
      onWinPage = true;
      onGame = false;
      winAmount ++;
      justWon = true;
      analyzeAwardData();
    }
    
    //drawing compasses
    for (let i = 0; i < compasses.length; i ++){
      if (abs(compasses[i][0]-turtleX) < 0.5*(screenSize+40) && abs(compasses[i][1]-turtleY) < 0.5*(screenSize+40)){
        drawCompass(compasses[i][0]-turtleX+0.5*screenSize,compasses[i][1]-turtleY+0.5*screenSize,getAngle(compasses[i][0],compasses[i][1],crownX,crownY)+compassWiggle*sin(compasses[i][2]*millis()),40);
      }
    }
    
    //drawing sparkles
    for (let i = sparkles.length-1; i >= 0; i --){
      if (sparkles[i].drawSparkle()){
        sparkles.splice(i,1);
      }
    }
    
    //drawing player
    drawTurtle(0.5*screenSize,0.5*screenSize,turtleAngle,40);
    
    //drawing lasers, getting rid of them if they're off screen
    for (let i = lasers.length-1; i >= 0; i --){
      drawLaser(lasers[i][0]-turtleX+0.5*screenSize,lasers[i][1]-turtleY+0.5*screenSize,lasers[i][2]);
      lasers[i][0] += lasers[i][3]*cos(lasers[i][2]);
      lasers[i][1] += lasers[i][3]*sin(lasers[i][2]);
      if (abs(lasers[i][0]-turtleX) > 0.5*(screenSize+laserLength) || abs(lasers[i][1]-turtleY) > 0.5*(screenSize+laserLength)){
        lasers.splice(i,1);
      }
    }
    
    //drawing laser gun on player
    if (lasersLeft > 0){
      drawLaserGun(0.5*screenSize,0.5*screenSize,turtleAngle,40);
    }
    
    //drawing rockets on player
    if (rocketLeft > 0){
      drawRockets(0.5*screenSize,0.5*screenSize,turtleAngle,40,keyIsDown(UP_ARROW));
    }
    
    //drawing bees
    for (let i = bees.length-1; i >= 0; i --){
      drawBees(bees[i][0]-turtleX+0.5*screenSize,bees[i][1]-turtleY+0.5*screenSize,30);
      var beeAngle = getAngle(bees[i][0],bees[i][1],turtleX,turtleY);
      bees[i][0] += beeSpeed*cos(beeAngle);
      bees[i][1] += beeSpeed*sin(beeAngle);
      //ending game if bees get player
      if (getDistance(bees[i][0],bees[i][1],turtleX,turtleY) < 30){
        onLosePage = true;
        onGame = false;
        loseAmount ++;
        justWon = false;
        analyzeAwardData();
      }
      //bees die when they're off screen
      else if (abs(bees[i][0]-turtleX) > 0.5*(screenSize+30) || abs(bees[i][1]-turtleY) > 0.5*(screenSize+30)){
        bees.splice(i,1);
        escapeAmount ++;
      }
    }
    //checking if player won awards for being chased by bees for a certain amount of time
    if (chaseBeganAt > -1){
      if (bees.length == 0){
        chaseBeganAt = -1;
      }
      else{
        if (awards[15].canGet() && millis()-chaseBeganAt >= 10000){
          awards[15].win()
          awards[16].unlock();
          newAward = true;
        }
        if (awards[16].canGet() && millis()-chaseBeganAt >= 30000){
          awards[16].win()
          newAward = true;
        }
      }
    }
    //checking if player won award for being chased by five swarms at once
    if (awards[17].canGet() && bees.length >= 5){
      awards[17].win()
      newAward = true;
    }
    
    //right and left arrows rotate turtle, up arrow accelerates
    if (keyIsDown(RIGHT_ARROW)){
      turtleAngle += turtleTwist;
      turtleVelocity -= turnFriction;
    }
    if (keyIsDown(LEFT_ARROW)){
      turtleAngle -= turtleTwist;
      turtleVelocity -= turnFriction;
    }
    
    if (keyIsDown(UP_ARROW)){
      turtleVelocity += turtleAcceleration;
      
      if (rocketLeft > 0){
        rocketLeft --;
        if (turtleVelocity > rocketSpeed){
          turtleVelocity = rocketSpeed;
        }
      }
      else if (turtleVelocity > (onRoad?roadSpeed:turtleSpeed)){
        turtleVelocity = (onRoad?roadSpeed:turtleSpeed);
      }
    }
    else if (turtleVelocity > 0){
      turtleVelocity -= turtleFriction;
    }
    if (turtleVelocity < 0){
      turtleVelocity = 0;
    }
    turtleX += turtleVelocity*cos(turtleAngle);
    turtleY += turtleVelocity*sin(turtleAngle);
    
    
    //space shoots lasers
    if (keyIsDown(32)){
      if (!pressing && lasersLeft > 0){
        pressing = true;
        lasersLeft --;
        append(lasers,[turtleX+30*cos(turtleAngle),turtleY+30*sin(turtleAngle),turtleAngle,laserSpeed+turtleVelocity]);
      }
    }
    else if (pressing){
      pressing = false;
    }
    
    //pressing esc, R, or M ends the game and brings player to the menu
    if (keyIsDown(27) || keyIsDown(77) || keyIsDown(82)){
      onGame = false;
      onMainMenu = true;
      justWon = false;
      analyzeAwardData();
    }
    
    
  }
}

//function is called at the beginning of a game, resets all necessary variables and arrays
function createGame(){
  turtleX = 0;
  turtleY = 0;
  lasersLeft = 0;
  turtleVelocity = 0;
  
  crownX = random(-maxDist,maxDist);
  crownY = random(-maxDist,maxDist);
  
  compasses = [];
  for (let i = 0; i < compassAmount; i ++){
    append(compasses,[random(-maxDist,maxDist),random(-maxDist,maxDist),random(0.1,0.3)]);
  }
  
  beehives = [];
  for (let i = 0; i < beehiveAmount; i ++){
    append(beehives,[random(-maxDist,maxDist),random(-maxDist,maxDist),true]);
    if (getDistance(beehives[i][0],beehives[i][1],turtleX,turtleY) < beehiveRadius){
      var hiveAngle = getAngle(turtleX,turtleY,beehives[i][0],beehives[i][1]);
      var hiveDist = getDistance(turtleX,turtleY,beehives[i][0],beehives[i][1]);
      beehives[i][0] = turtleX+(hiveDist+beehiveRadius)*cos(hiveAngle);
      beehives[i][1] = turtleY+(hiveDist+beehiveRadius)*sin(hiveAngle);
    }
  }
  
  laserGuns = [];
  for (let i = 0; i < laserGunAmount; i ++){
    append(laserGuns,[random(-maxDist,maxDist),random(-maxDist,maxDist)]);
  }
  
  rocketGifts = [];
  for (let i = 0; i < rocketGiftAmount; i ++){
    append(rocketGifts,[random(-maxDist,maxDist),random(-maxDist,maxDist)]);
  }
  
  verticalRoads = [];
  horizontalRoads = [];
  for (let i = 0; i < roadAmount; i ++){
    append(verticalRoads,random(-maxDist,maxDist));
    append(horizontalRoads,random(-maxDist,maxDist));
  }
  
  rocketLeft = 0;
  bees = [];
  lasers = [];
  sparkles = [];
  escapeAmount = 0;
  chaseBeganAt = -1;
  amountOnRoad = 0;
  amountOffRoad = 0;
}

//function is called at the end of a game, checks to see if any awards are won
function analyzeAwardData(){
  if (awards[0].canGet() && winAmount == 1){
    awards[0].win()
    awards[1].unlock();
    newAward = true;
  }
  if (awards[1].canGet() && winAmount == 10){
    awards[1].win()
    awards[2].unlock();
    newAward = true;
  }
  if (awards[2].canGet() && winAmount == 30){
    awards[2].win()
    newAward = true;
  }
  
  if (awards[3].canGet() && loseAmount == 1){
    awards[3].win()
    awards[4].unlock();
    newAward = true;
  }
  if (awards[4].canGet() && loseAmount == 10){
    awards[4].win()
    awards[5].unlock();
    newAward = true;
  }
  if (awards[5].canGet() && loseAmount == 30){
    awards[5].win()
    newAward = true;
  }
  
  if (awards[6].canGet() && escapeAmount >= 1){
    awards[6].win()
    awards[7].unlock();
    newAward = true;
  }
  if (awards[7].canGet() && escapeAmount >= 3){
    awards[7].win()
    awards[8].unlock();
    newAward = true;
  }
  if (awards[8].canGet() && escapeAmount >= 10){
    awards[8].win()
    newAward = true;
  }
  
  if (awards[9].canGet() && beehives.length <= beehiveAmount-1){
    awards[9].win()
    awards[10].unlock();
    newAward = true;
  }
  if (awards[10].canGet() && beehives.length <= beehiveAmount-10){
    awards[10].win()
    awards[11].unlock();
    newAward = true;
  }
  if (awards[11].canGet() && beehives.length <= beehiveAmount-20){
    awards[11].win()
    awards[12].unlock();
    newAward = true;
  }
  if (awards[12].canGet() && beehives.length == 0){
    awards[12].win()
    newAward = true;
  }
  
  if (awards[13].canGet() && laserGuns.length == 0){
    awards[13].win()
    newAward = true;
  }
  if (awards[14].canGet() && rocketGifts.length == 0){
    awards[14].win()
    newAward = true;
  }
  
  //awards[15], awards[16], & awards[17] in onGame section of draw()
  
  if (awards[18].canGet() && justWon && amountOffRoad/(amountOnRoad+amountOffRoad) > 0.95){
    awards[18].win()
    awards[19].unlock();
    newAward = true;
  }
  if (awards[19].canGet() && justWon && amountOnRoad/(amountOnRoad+amountOffRoad) > 0.95){
    awards[19].win()
    newAward = true;
  }
}

//function is called to get save code for a game
function encodeSaveData(){
  //0: locked
  //1: unlocked, not won
  //2: won
  
  var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  var letterDict = createStringDict({a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9, k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18,t:19,u:20,v:21,w:22,x:23,y:24,z:25});
  
  //gets 20 values, 0-2 for each award
  var awardValues = [];
  for (let i = 0; i < awards.length; i ++){
    if (awards[i].hasWon){
      append(awardValues,2);
    }else if (awards[i].isUnlocked){
      append(awardValues,1);
    }else{
      append(awardValues,0);
    }
  }
  //award values are converted from base-3 to base-26
  awardValues = changeBase(awardValues,3,encodedBase,true);
  //8th value is added to each letter
  var addValue = floor(random(0,encodedBase));
  for (let i = 0; i < awardValues.length; i ++){
    awardValues[i] = letters[(letterDict.get(awardValues[i])+addValue)%letters.length];
  }
  append(awardValues,letters[addValue]);
  return awardValues;
}

//function is called when save code is entered, changes values of each award
function getSaveData(encodedVals){
  var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  var letterDict = createStringDict({a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9, k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18,t:19,u:20,v:21,w:22,x:23,y:24,z:25});
  
  //finding added value and subtracting it
  var addValue = letterDict.get(encodedVals[encodedVals.length-1]);
  var decodedVals = [];
  for (let i = 0; i < encodedVals.length-1; i ++){
    var newLetterNum = letterDict.get(encodedVals[i])-addValue;
    if (newLetterNum < 0){
      newLetterNum = encodedBase+newLetterNum;
    }
    append(decodedVals,letters[newLetterNum]);
  }
  
  //changing from base-26 to base-3
  var awardVals = changeBase(decodedVals,encodedBase,3,false);
  //changing values of awards
  for (let i = 0; i < awards.length; i ++){
    if (awardVals[i] == 2){
      awards[i].hasWon = true;
      awards[i].isUnlocked = true;
    }else if (awardVals[i] == 1){
      awards[i].hasWon = false;
      awards[i].isUnlocked = true;
    }else{
      awards[i].hasWon = false;
      awards[i].isUnlocked = false;
    }
  }
}

//function is used by encodeSaveData() and getSaveData()
//modified from Useful Functions version to change to letters-only output when makeLetters is true
function changeBase(numList,fromBase,toBase,makeLetters){
  var digitStrings = createStringDict({
    a: 0, 
    b: 1, 
    c: 2, 
    d: 3, 
    e: 4, 
    f: 5, 
    g: 6, 
    h: 7, 
    i: 8, 
    j: 9, 
    k: 10, 
    l: 11, 
    m: 12, 
    n: 13, 
    o: 14, 
    p: 15, 
    q: 16, 
    r: 17, 
    s: 18, 
    t: 19, 
    u: 20, 
    v: 21, 
    w: 22, 
    x: 23, 
    y: 24, 
    z: 25
  });
  var digitList = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  
  var numArray = [];
  for (let i = 0; i < numList.length; i ++){
    if (numList[i].length != undefined){
      append(numArray,digitStrings.get(numList[i]));
    }else{
      append(numArray,numList[i]);
    }
  }
  
  var newNum = [];
  var num = 0;
  for (let i = 0; i < numArray.length; i ++){
    num += numArray[i]*pow(fromBase,numArray.length-1-i);
  }
  var maxPow = 0;
  while(num > pow(toBase,maxPow+1)){
    maxPow ++;
  }
  for (let i = maxPow; i >= 0; i --){
    var digit = 0;
    while (num >= (digit+1)*pow(toBase,i)){
      digit ++;
    }
    append(newNum,digit);
    num -= (digit)*pow(toBase,i);
  }
  if (makeLetters){
    for (let i = 0; i < newNum.length; i ++){
      newNum[i] = digitList[newNum[i]];
    }
  }
  return newNum;
}

//fire from rockets and explosion when a beehive is shot are Sparkles
class Sparkle{
  constructor(sparkleX,sparkleY,rVal,gVal,bVal,angle,speed,size,lifespan){
    this.sparkleX = sparkleX;
    this.sparkleY = sparkleY;
    this.rVal = rVal;
    this.gVal = gVal;
    this.bVal = bVal;
    this.angle = angle;
    this.speed = speed;
    this.lifespan = lifespan;
    this.lifeAt = lifespan;
    this.size = size;
  }
  drawSparkle(){
    push();
    noStroke();
    fill(this.rVal,this.gVal,this.bVal,255*this.lifeAt/this.lifespan);
    square(this.sparkleX-turtleX+0.5*screenSize,this.sparkleY-turtleY+0.5*screenSize,this.size);
    this.sparkleX += this.speed*cos(this.angle);
    this.sparkleY += this.speed*sin(this.angle);
    this.lifespan --;
    pop();
    if (this.lifespan <= 0){
      return true;
    }
    return false;
  }
}

class Award{
  constructor(title,description,isUnlocked){
    this.title = title;
    this.description = description;
    this.isUnlocked = isUnlocked;
    this.hasWon = false;
    this.justWonAward = false;
    this.justUnlocked = false;
  }
  unlock(){
    this.isUnlocked = true;
    this.justUnlocked = true;
  }
  canGet(){
    return !this.hasWon && this.isUnlocked && !this.justUnlocked;
  }
  win(){
    this.hasWon = true;
    this.justWonAward = true;
  }
}

//when runButton() is called, it draws a button with given size and text, changes color when mouse is on it, and returns true if it is clicked
class Button{
  constructor(xPos,yPos,words,buttonWidth,buttonHeight,wordSize){
    this.xPos = xPos;
    this.yPos = yPos;
    this.words = words;
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    this.wordSize = wordSize;
  }
  runButton(){
    push();
    if (clicking && !mouseIsPressed){
      clicking = false;
    }
    strokeWeight(3);
    textFont(buttonFont,this.wordSize);
    textAlign(CENTER,CENTER);
    fill(255);
    var isClicked = false;
    if (abs(mouseX-this.xPos) < 0.5*this.buttonWidth && abs(mouseY-this.yPos) < 0.5*this.buttonHeight){
      fill(150);
      if (mouseIsPressed && !clicking){
        isClicked = true;
        clicking = true;
      }
    }
    rect(this.xPos,this.yPos,this.buttonWidth,this.buttonHeight);
    fill(0);
    text(this.words,this.xPos,this.yPos);
    pop();
    return isClicked;
  }
  notification(){
    push();
    fill(255,0,0);
    strokeWeight(3);
    circle(this.xPos+0.5*this.buttonWidth,this.yPos-0.5*this.buttonHeight,newAwardBubbleSize);
    pop();
  }
}


//functions used to draw certain objects in the game:
function drawLock(xPos,yPos,size,unlocked){
  push();
  strokeWeight(3);
  fill(100);
  square(xPos,yPos+0.25*size,0.75*size);
  noFill();
  if (unlocked){
    arc(xPos,yPos-0.25*size,0.5*size,0.5*size,-135,0);
  }else{
    arc(xPos,yPos-0.25*size,0.5*size,0.5*size,-180,0);
  }
  pop();
}

function drawUpsideDownTurtle(xPos,yPos,size){
  push();
  fill(0,255,0);
  strokeWeight(3);
  var shellBrimHeight = 0.2*size;
  
  drawHotDog(xPos+0.5*size,yPos+0.05*size,0.6*size,0.3*size);
  
  rect(xPos-0.25*size,yPos-shellBrimHeight,0.3*size,0.5*size,5);
  rect(xPos+0.25*size,yPos-shellBrimHeight,0.3*size,0.5*size,5);
  
  arc(xPos,yPos,size,size,0,180);
  
  drawHotDog(xPos,yPos-0.5*shellBrimHeight,1.1*size,shellBrimHeight);
  
  line(xPos+0.5*size*cos(50),yPos+0.5*size*sin(50),xPos+0.5*size*cos(50),yPos);
  line(xPos-0.5*size*cos(50),yPos+0.5*size*sin(50),xPos-0.5*size*cos(50),yPos);
  line(xPos,yPos+0.5*size,xPos,yPos);
  line(xPos+0.5*size*cos(30),yPos+0.5*size*sin(30),xPos-0.5*size*cos(30),yPos+0.5*size*sin(30));
  
  pop();
}

function drawStandingTurtle(xPos,yPos,size){
  push();
  fill(0,255,0);
  strokeWeight(3);
  var shellBrimHeight = 0.2*size;
  
  drawHotDog(xPos+0.5*size,yPos-0.05*size,0.6*size,0.3*size);
  
  rect(xPos-0.25*size,yPos+shellBrimHeight,0.3*size,0.5*size,5);
  rect(xPos+0.25*size,yPos+shellBrimHeight,0.3*size,0.5*size,5);
  
  arc(xPos,yPos,size,size,180,0);
  
  drawHotDog(xPos,yPos+0.5*shellBrimHeight,1.1*size,shellBrimHeight);
  
  line(xPos+0.5*size*cos(50),yPos-0.5*size*sin(50),xPos+0.5*size*cos(50),yPos);
  line(xPos-0.5*size*cos(50),yPos-0.5*size*sin(50),xPos-0.5*size*cos(50),yPos);
  line(xPos,yPos-0.5*size,xPos,yPos);
  line(xPos+0.5*size*cos(30),yPos-0.5*size*sin(30),xPos-0.5*size*cos(30),yPos-0.5*size*sin(30));
  
  pop();
}

function drawRockets(xPos,yPos,facing,size,turnedOn){
  push();
  fill(200);
  strokeWeight(3);
  
  var rocketWidth = 0.3*size;
  
  var rocketX = xPos+0.5*(size+rocketWidth)*cos(facing+90);
  var rocketY = yPos+0.5*(size+rocketWidth)*sin(facing+90);
  beginShape();
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+45), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+45));
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+135), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+135));
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+225), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+225));
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+315), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+315));
  endShape();
  arc(rocketX+0.5*rocketWidth*cos(facing),rocketY+0.5*rocketWidth*sin(facing), rocketWidth,rocketWidth,facing-90,facing+90);
  if (turnedOn){
    append(sparkles,new Sparkle(turtleX+rocketX-0.5*screenSize+random(-0.5*rocketWidth,0.5*rocketWidth),turtleY+rocketY-0.5*screenSize+random(-0.5*rocketWidth,0.5*rocketWidth),
                                random(200,255),random(0,200),0,
                               0,0,4,random(5,15)));
  }
  
  rocketX = xPos+0.5*(size+rocketWidth)*cos(facing-90);
  rocketY = yPos+0.5*(size+rocketWidth)*sin(facing-90);
  beginShape();
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+45), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+45));
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+135), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+135));
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+225), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+225));
  vertex(rocketX+0.5*sqrt(2)*rocketWidth*cos(facing+315), rocketY+0.5*sqrt(2)*rocketWidth*sin(facing+315));
  endShape();
  arc(rocketX+0.5*rocketWidth*cos(facing),rocketY+0.5*rocketWidth*sin(facing), rocketWidth,rocketWidth,facing-90,facing+90);
  if (turnedOn){
    append(sparkles,new Sparkle(turtleX+rocketX-0.5*screenSize+random(-0.5*rocketWidth,0.5*rocketWidth),turtleY+rocketY-0.5*screenSize+random(-0.5*rocketWidth,0.5*rocketWidth),
                                random(200,255),random(0,200),0,
                               0,0,4,random(5,15)));
  }
  
  pop();
}

function drawLaser(xPos,yPos,facing){
  push();
  strokeWeight(3);
  stroke(255,0,0);
  line(xPos-0.5*laserLength*cos(facing),yPos-0.5*laserLength*sin(facing),xPos+0.5*laserLength*cos(facing),yPos+0.5*laserLength*sin(facing));
  pop();
}

function drawLaserGunGift(xPos,yPos,size){
  push();
  fill(255);
  strokeWeight(3);
  circle(xPos,yPos,size);
  stroke(255,0,0);
  for (let i = 0; i < 5; i ++){
    line(xPos+0.15*size*cos(i*360/5),yPos+0.15*size*sin(i*360/5),
         xPos+0.3*size*cos(i*360/5),yPos+0.3*size*sin(i*360/5))
  }
  pop();
}

function drawRocketGift(xPos,yPos,size){
  push();
  fill(255);
  strokeWeight(3);
  circle(xPos,yPos,size);
  
  fill(200);
  
  var rocketSize = 0.3*size;
  
  stroke(255,0,0);
  line(xPos,yPos,xPos-1*rocketSize,yPos);
  stroke(255,100,0);
  line(xPos,yPos-0.25*rocketSize,xPos-0.8*rocketSize,yPos-0.25*rocketSize);
  line(xPos,yPos+0.25*rocketSize,xPos-0.8*rocketSize,yPos+0.25*rocketSize);
  
  stroke(0);
  
  beginShape();
  vertex(xPos+0.5*rocketSize,yPos+0.5*rocketSize);
  vertex(xPos-0.5*rocketSize,yPos+0.5*rocketSize);
  vertex(xPos-0.5*rocketSize,yPos-0.5*rocketSize);
  vertex(xPos+0.5*rocketSize,yPos-0.5*rocketSize);
  endShape();
  
  arc(xPos+0.5*rocketSize,yPos,rocketSize,rocketSize,-90,90);
  
  pop();
}

function drawBees(xPos,yPos,size){
  push();
  fill(0);
  for (let i = 0; i < beeAmount; i ++){
    var testAngle = random(0,360);
    var testDist = random(0,0.5*size);
    circle(xPos+testDist*cos(testAngle),yPos+testDist*sin(testAngle),1);
  }
  pop();
}

function drawHive(xPos,yPos,size){
  push();
  fill(255,200,0);
  
  strokeWeight(3);
  drawHotDog(xPos,yPos,size,0.2*size);
  drawHotDog(xPos,yPos-0.2*size,0.9*size,0.2*size);
  drawHotDog(xPos,yPos+0.2*size,0.9*size,0.2*size);
  drawHotDog(xPos,yPos-0.4*size,0.6*size,0.2*size);
  drawHotDog(xPos,yPos+0.4*size,0.6*size,0.2*size);
  
  fill(0);
  circle(xPos,yPos-0.05*size,0.2*size);
  square(xPos,yPos+0.05*size,0.2*size);
  
  pop();
}

function drawHotDog(xPos,yPos,wVal,hVal){
  push();
  noStroke();
  rect(xPos,yPos,wVal-hVal,hVal);
  pop();
  
  arc(xPos-0.5*wVal+0.5*hVal,yPos,hVal,hVal,90,270);
  arc(xPos+0.5*wVal-0.5*hVal,yPos,hVal,hVal,270,90);
  line(xPos-0.5*wVal+0.5*hVal,yPos-0.5*hVal,xPos+0.5*wVal-0.5*hVal,yPos-0.5*hVal);
  line(xPos-0.5*wVal+0.5*hVal,yPos+0.5*hVal,xPos+0.5*wVal-0.5*hVal,yPos+0.5*hVal);
}

function drawCompass(xPos,yPos,facing,size){
  push();
  strokeWeight(3);
  fill(255);
  circle(xPos,yPos,size);
  
  strokeWeight(2);
  fill(255,0,0);
  triangle(xPos+0.1*size*cos(facing+90), yPos+0.1*size*sin(facing+90),xPos+0.1*size*cos(facing-90),yPos+0.1*size*sin(facing-90),xPos+0.4*size*cos(facing),yPos+0.4*size*sin(facing));
  
  fill(200,200,255);
  triangle(xPos+0.1*size*cos(facing+90), yPos+0.1*size*sin(facing+90),xPos+0.1*size*cos(facing-90),yPos+0.1*size*sin(facing-90),xPos-0.4*size*cos(facing),yPos-0.4*size*sin(facing));
  pop();
}

function drawTurtle(xPos,yPos,facing,size){
  push();
  fill(0,255,0);
  strokeWeight(3);
  
  circle(xPos+0.7*size*cos(facing),yPos+0.7*size*sin(facing),0.4*size);
  circle(xPos,yPos,size);
  
  strokeWeight(2);
  
  line(xPos-0.5*size*cos(facing+30),yPos-0.5*size*sin(facing+30),xPos+0.5*size*cos(facing-30),yPos+0.5*size*sin(facing-30));
  line(xPos-0.5*size*cos(facing-30),yPos-0.5*size*sin(facing-30),xPos+0.5*size*cos(facing+30),yPos+0.5*size*sin(facing+30));
  line(xPos-0.5*size*cos(facing),yPos-0.5*size*sin(facing),xPos+0.5*size*cos(facing),yPos+0.5*size*sin(facing));
  
  line(xPos-0.5*size*cos(facing+60),yPos-0.5*size*sin(facing+60),xPos-0.5*size*cos(facing-60),yPos-0.5*size*sin(facing-60));
  line(xPos+0.5*size*cos(facing+60),yPos+0.5*size*sin(facing+60),xPos+0.5*size*cos(facing-60),yPos+0.5*size*sin(facing-60));
  line(xPos-0.5*size*cos(facing+90),yPos-0.5*size*sin(facing+90),xPos-0.5*size*cos(facing-90),yPos-0.5*size*sin(facing-90));
  
  pop();
}

function drawLaserGun(xPos,yPos,facing,size){
  push();
  strokeWeight(3);
  fill(130,130,150);
  var boxAngle = 25;
  
  beginShape();
  vertex(xPos+0.5*size*cos(facing+boxAngle),yPos+0.5*size*sin(facing+boxAngle));
  vertex(xPos-0.5*size*cos(facing-boxAngle),yPos-0.5*size*sin(facing-boxAngle));
  vertex(xPos-0.5*size*cos(facing+boxAngle),yPos-0.5*size*sin(facing+boxAngle));
  vertex(xPos+0.5*size*cos(facing-boxAngle),yPos+0.5*size*sin(facing-boxAngle));
  //vertex(xPos+0.8*size*cos(facing),yPos+0.8*size*sin(facing))
  endShape(CLOSE);
  
  line(xPos+0.5*size*cos(facing),yPos+0.5*size*sin(facing),xPos+0.85*size*cos(facing),yPos+0.85*size*sin(facing));
  fill(255,0,0);
  circle(xPos+0.85*size*cos(facing),yPos+0.85*size*sin(facing),0.25*size);
  
  stroke(255,0,0);
  line(xPos+0.57*size*cos(facing+boxAngle),yPos+0.57*size*sin(facing+boxAngle),
      xPos+0.57*size*cos(facing-boxAngle),yPos+0.57*size*sin(facing-boxAngle));
  
  pop();
}

function drawCrown(xPos,yPos,size){
  push();
  fill(255,255,0);
  stroke(0);
  strokeWeight(3);
  
  beginShape();
  vertex(xPos+0.5*size,yPos+0.5*size);
  vertex(xPos-0.5*size,yPos+0.5*size);
  vertex(xPos-0.5*size,yPos-0.4*size);
  vertex(xPos-0.25*size,yPos-0.15*size);
  vertex(xPos,yPos-0.4*size);
  vertex(xPos+0.25*size,yPos-0.15*size);
  vertex(xPos+0.5*size,yPos-0.4*size);
  endShape(CLOSE);
  pop();
}



function getAngle(x1,y1,x2,y2){
  var ang = atan((y1-y2)/(x1-x2));
  if (x2 <= x1){
    ang += 180;
  }
  return ang;
}

function getDistance(x1,y1,x2,y2){
  return sqrt(pow(x1-x2,2) + pow(y1-y2,2));
}
