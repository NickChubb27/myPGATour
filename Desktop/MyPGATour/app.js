var leftButton = document.getElementById("leftButton");
var rightButton = document.getElementById("rightButton");
var nextHoleButton = document.getElementById("nextHole");
var currentHoleSpan = document.getElementById("currentHole");
var currentScoreSpan = document.getElementById("currentScore");
var currentHole = 0;
var scorePossibility = ["Albatross", "Eagle", "Birdie", "Par", "Bogey", "Double-Bogey", "Triple-Bogey", "Quadruple Bogey","5+"];
var players = ["Joe Burnett","Tiger Woods","Dustin Johnson","Rory McIlroy","Jason Day","Hideki Matsuyama","Jordan Spieth","Sergio Garcia","Justin Rose","Henrik Stenson","Rickie Fowler","Justin Thomas","Adam Scott","Jon Rahm","Alex Noren","Phil Mickelson","Matt Kuchar","Brooks Koepka","Danny Willet","Bubba Watson","Brandt Snedeker","Tommy Fleetwood","Bernd Wiesberger","Russell Knox","Ryan Moore","Marc Leishman","Louis Oosthuizen","Francesco Molinari","Rafa Cabrera Bello","Wesley Bryan","Daniel Berger","Gary Woodland","Kevin Kisner","Pat Perez","Bill Haas","J.B. Holmes","Ross Fisher","William McGirt","Adam Hadwin","Martin Kaymer","Russell Henley","Lee Westwood","Brian Harman","Charley Hoffman","Scott Piercy","Kevin Na","Zach Johnson","Brenan Steele","Jhonattan Vegas","Chris Wood","Jason Dufner","Andy Sullivan","Soren Kjeldson","Charles Howell III","Tony Finau","Webb Simpson","Jim Furyk","Shane Lowry","Luke Donald","Billy Horschel","Hudson Swafford","Jim Herman"];
var sep = 1;
var playersScores = [];
var myScore = 0;
var whatHole = 1;
var leaderboardTable = document.getElementById("leaderboard");
var myPlayerName = "Joe Burnett";

var numPlayers = players.length;
for (var i = 0; i < numPlayers; i++) {
    playersScores[i] = [players[i],0];
}

leftButton.onclick = function() {adjustScore("left")};
rightButton.onclick = function() {adjustScore("right")};
nextHoleButton.onclick = function() {nextHole()};

function adjustScore(direction) {
    if(direction == "left") {
        if(currentHole > -3) {
            currentHole--;
            currentScoreSpan.innerHTML = scorePossibility[currentHole+3];
        }
    } else {
        if(currentHole < 5) {
            currentHole++;
            currentScoreSpan.innerHTML = scorePossibility[currentHole+3];
        }
    }
}

function nextHole() {
    if(whatHole < 18) {
        myScore = myScore+currentHole;
        updateScores();
        currentHole = 0;
        whatHole++;
        currentHoleSpan.innerHTML = whatHole;
        currentScoreSpan.innerHTML = scorePossibility[3];
    }
}

function updateScores() {
    var myAverageScore = myScore/whatHole;
        
    for (i = 0; i < players.length; i++) {
        if(i == 0) { //update my score
            playersScores[i][1] = myScore; //0=me , 1= score
        } else {
            //update all other players score
            var newScore = scoreAlg(i,myAverageScore);
            playersScores[i][1] = newScore+playersScores[i][1];
        }
    }
    updateLeaderBoard(reOrderPlayers());
}

function reOrderPlayers (){
    var justScores = [];
    var reOrderedPlayers = [];
    for (i = 0; i < playersScores.length; i++) {
        justScores[i] = playersScores[i][1];
    }
    
    var reOrdered = justScores.sort(function(a, b){return a-b}); //reorder it
    
    for (i = 0; i < playersScores.length; i++) {
        var score = reOrdered[i];
        for (j = 0; j < playersScores.length; j++) {
            if(playersScores[j][1] == score) {
                //if(reOrderedPlayers.includes(playersScores[j][0]) == false) {
                  //  reOrderedPlayers.push([playersScores[j][0],score]);
                //}
                var a = 0;
                for(d = 0; d < reOrderedPlayers.length; d++) { //check to see if it contains it.
                    if(reOrderedPlayers[d][0] == playersScores[j][0]) {
                        a++;
                    }
                }
                
                if(a == 0) {
                    reOrderedPlayers.push([playersScores[j][0], score]);
                }
            }
        }
    }
    return reOrderedPlayers;
    
}

function scoreAlg(i,Avg) {
    var percentile = i/players.length
    var random = Math.floor(Math.random() * 100) + 1;
    var sign = Math.floor(Math.random() * 100) + 1;
    var rand = random/100;
    
    if(sign <= 50) {
        rand = -rand;
    }
    
    if(percentile <= .04) {
        var newScore = Math.round(Avg+(rand-.03));
    } else if(percentile <= .1) {
        var newScore = Math.round(Avg+rand+.03);
    } else if(percentile <= .25) {
        var newScore = Math.round(Avg+(rand+.08));
    } else if(percentile <= .5) {
        var newScore = Math.round(Avg+(rand+.1));
    } else if(percentile <= .75) {
        var newScore = Math.round(Avg+(rand+.15));
    } else {
        var newScore = Math.round(Avg+(rand+.3));
    }
    return newScore;
}

var posLast = 0;

function updateLeaderBoard(orderedPlayers) {
    var updatedLeaderBoard = document.createElement('tbody');
    updatedLeaderBoard.setAttribute("id", "leaderboard");
    for (i = 0; i < players.length; i++) {
        var tr = document.createElement('TR');
        var tdPos = document.createElement('TD');
        var tdPlayer = document.createElement('TD');
        var tdTotal = document.createElement('TD');
        var pos = i+1;
        
        var upI = i+1;
        var DownI = i-1;
        
        if(i != 0) {
        if(orderedPlayers[DownI][1] != orderedPlayers[i][1]) {
            if(i != players.length-1) {
                if(orderedPlayers[upI][1] == orderedPlayers[i][1]) {
                    tdPos.appendChild(document.createTextNode("T-"+pos));
                    posLast = pos;
                } else {
                    tdPos.appendChild(document.createTextNode(pos));
                }
            } else {
                tdPos.appendChild(document.createTextNode(pos));
            }
         } else {
            tdPos.appendChild(document.createTextNode("T-"+posLast));
         }
        } else {
            if(orderedPlayers[upI][1] == orderedPlayers[i][1]) {
                tdPos.appendChild(document.createTextNode("T-"+pos));
                posLast = pos;
            } else {
                tdPos.appendChild(document.createTextNode(pos));
            }
        }
        
        
        if(orderedPlayers[i][0] == myPlayerName) { //BOLD My name
            var nameElement = document.createElement("b");
            nameElement.innerHTML = "Joe Burnett";
            tdPlayer.appendChild(nameElement);
        } else {
            tdPlayer.appendChild(document.createTextNode(orderedPlayers[i][0]));
        }
        if(orderedPlayers[i][1] >= 1) {
            var tot = "+"+orderedPlayers[i][1];
        } else if(orderedPlayers[i][1] == 0) {
            var tot = "E";
        } else {
            var tot = orderedPlayers[i][1];
        }
        tdTotal.appendChild(document.createTextNode(tot));
        
        tr.appendChild(tdPos);
        tr.appendChild(tdPlayer);
        tr.appendChild(tdTotal);
    
        updatedLeaderBoard.appendChild(tr);
}
    leaderboardTable.parentNode.replaceChild(updatedLeaderBoard,leaderboardTable);
    leaderboardTable = document.getElementById("leaderboard");
}