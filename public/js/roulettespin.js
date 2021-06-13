
var $inner = $('.inner'),
$spin = $('#spin'),
$reset = $('#reset'),
$data = $('.data'),
$mask = $('.mask'),
maskDefault = 'Place Your Bets',
timer = 9000;

var red = [9,30,7,32,5,34,3,36,1,27,25,12,19,18,21,16,23,14];
$reset.hide();

$mask.text(maskDefault);

$spin.on('click',function(){
// get a random number between 0 and 37 and apply it to the nth-child selector
var randomNumber = randomSpin(),
 color = null;
 $inner.attr('data-spinto', randomNumber).find('li:nth-child('+ randomNumber +') input').prop('checked','checked');
 // prevent repeated clicks on the spin button by hiding it
  $(this).hide();
 // disable the reset button until the ball has stopped spinning
  $reset.addClass('disabled').prop('disabled','disabled').show();

 $('.placeholder').remove();


setTimeout(function() {
 $mask.text('No More Bets');
 }, timer/2);

setTimeout(function() {
 $mask.text(maskDefault);
 }, timer+500);



// remove the disabled attribute when the ball has stopped
setTimeout(function() {
$reset.removeClass('disabled').prop('disabled','');

if($.inArray(randomNumber, red) !== -1){ color = 'red'} else { color = 'black'};
if(randomNumber == 0 || randomNumber == 37) {color = 'green'};
let showNumber=randomNumber;
if (showNumber == 37)
showNumber = '00';

$('.result-number').text(showNumber);
$('.result-color').text(color);
if (color=='green'){
    $('.result').css({'background-color': ''+'rgb(6,118,75)'+''});
}
else{
    $('.result').css({'background-color': ''+color+''});
}
$data.addClass('reveal');
$inner.addClass('rest');

$thisResult = '<li class="previous-result color-'+ color +'"><span class="previous-number">'+ showNumber +'</span><span class="previous-color">'+ color +'</span></li>';

$('.previous-list').prepend($thisResult);


}, timer);
playRound(randomNumber);
});


$reset.on('click',function(){
// remove the spinto data attr so the ball 'resets'
$inner.attr('data-spinto','').removeClass('rest');
$(this).hide();
$spin.show();
$data.removeClass('reveal');
});

// so you can swipe it too
var myElement = document.getElementById('plate');
var mc = new Hammer(myElement);
mc.on("swipe", function(ev) {
if(!$reset.hasClass('disabled')){
if($spin.is(':visible')){
 $spin.click();  
} else {
 $reset.click();
}
}  
});
// 
// 
// 
// 
// 

//37 reprezinta pariu pe 00
var VALID_BETS=[
[0], //straights
[37],
[1],
[2],
[3],
[4],
[5],
[6],
[7],
[8],
[9],
[10],
[11],
[12],
[13],
[14],
[15],
[16],
[17],
[18],
[19],
[20],
[21],
[22],
[23],
[24],
[25],
[26],
[27],
[28],
[29],
[30],
[31],
[32],
[33],
[34],
[35],
[36], //index 37

[0,37], //perechi cu 0 si 00
[0,1],
[0,2],
[37,2],
[37,3],

[1, 2],
[2, 3],
[4, 5],
[5, 6],
[7, 8],
[8, 9],
[10, 11],
[11, 12],
[13, 14],
[14, 15],
[16, 17],
[17, 18],
[19, 20],
[20, 21],
[22, 23],
[23, 24],
[25, 26],
[26, 27],
[28, 29],
[29, 30],
[31, 32],
[32, 33],
[34, 35],
[35, 36],

[1, 4],
[2, 5],
[3, 6],
[4, 7],
[5, 8],
[6, 9],
[7, 10],
[8, 11],
[9, 12],
[10, 13],
[11, 14],
[12, 15],
[13, 16],
[14, 17],
[15, 18],
[16, 19],
[17, 20],
[18, 21],
[19, 22],
[20, 23],
[21, 24],
[22, 25],
[23, 26],
[24, 27],
[25, 28],
[26, 29],
[27, 30],
[28, 31],
[29, 32],
[30, 33],
[31, 34],
[32, 35],
[33, 36],

[0, 1, 2],
[0, 37, 2],
[37, 2, 3],

[1, 2, 3],
[4, 5, 6],
[7, 8, 9],
[10, 11, 12],
[13, 14, 15],
[16, 17, 18],
[19, 20, 21],
[22, 23, 24],
[25, 26, 27],
[28, 29, 30],
[31, 32, 33],
[34, 35, 36],

[1, 2, 4, 5],
[2, 3, 5, 6],
[4, 5, 7, 8],
[5, 6, 8, 9],
[7, 8, 10, 11],
[8, 9, 11, 12],
[10, 11, 13, 14],
[11, 12, 14, 15],
[13, 14, 16, 17],
[14, 15, 17, 18],
[16, 17, 19, 20],
[17, 18, 20, 21],
[19, 20, 22, 23],
[20, 21, 23, 24],
[22, 23, 25, 26],
[23, 24, 26, 27],
[25, 26, 28, 29],
[26, 27, 29, 30],
[28, 29, 31, 32],
[29, 30, 32, 33],
[31, 32, 34, 35],
[32, 33, 35, 36],

[0, 37, 1, 2, 3],

[1, 2, 3, 4, 5, 6],
[4, 5, 6, 7, 8, 9],
[7, 8, 9, 10, 11, 12],
[10, 11, 12, 13, 14, 15],
[13, 14, 15, 16, 17, 18],
[16, 17, 18, 19, 20, 21],
[19, 20, 21, 22, 23, 24],
[22, 23, 24, 25, 26, 27],
[25, 26, 27, 28, 29, 30],
[28, 29, 30, 31, 32, 33],
[31, 32, 33, 34, 35, 36],

[1,2,3,4,5,6,7,8,9,10,11,12],//1st 12
[13,14,15,16,17,18,19,20,21,22,23,24],
[25,26,27,28,29,30,31,32,33,34,35,36],

[1,4,7,10,13,16,19,22,25,28,31,34],//1st col
[2,5,8,11,14,17,20,23,26,29,32,35],
[3,6,9,12,15,18,21,24,27,30,33,36],

[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],//1st 18
[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],

[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],//odd

[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],//red
[2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]//black
];

var VALID_PAYOUTS=[];
for (let i=0;i< 38;i++) VALID_PAYOUTS[i]=35;
for (let i=38;i< 100;i++) VALID_PAYOUTS[i]=17;
for (let i=100;i< 115;i++) VALID_PAYOUTS[i]=11;
for (let i=115;i< 137;i++) VALID_PAYOUTS[i]=8;
VALID_PAYOUTS[137]=6;
for (let i=138;i< 149;i++) VALID_PAYOUTS[i]=5;
for (let i=149;i< 155;i++) VALID_PAYOUTS[i]=2;
for (let i=155;i< 161;i++) VALID_PAYOUTS[i]=1;


class Player {
    constructor(id, amount){
        this.id = id;
        this.amount =amount;
        this.bets =[];
    }

    placeBet(amount, betIndex){
        if (this.amount>=amount){
            this.amount-=amount;
            this.bets.push(new Bet(this.id, amount, VALID_BETS[betIndex], VALID_PAYOUTS[betIndex]));

            let betLog ='<li class="previous-result color-green"><span class="previous-number">'+ "Placed bet for "+amount+' on '+ VALID_BETS[betIndex] +'</span></li>';
            betLog= betLog.replace("37", "00");
            $('.betting-queue').prepend(betLog)
            this.updateMoneyBar()
        }
        else{
            console.log("not enough funds for this bet");
        }
    }
    checkFunds(){
        let betSum=0;
        betSum += this.bets.reduce( (p, c) => p+c.amount, 0);
        if (betSum <= this.amount){
            this.amount-=betSum;
            this.updateMoneyBar()
            return true;
        }
        else{
            console.log("not enough funds for the last bets");
            this.bets=[];
            this.updateMoneyBar()
            return false;
        }
    }
    checkWins(spinResult){
        this.bets.forEach(bet => {
            if (bet.winCondition(spinResult)){
                this.amount+=bet.amount*(bet.payout+1);
                this.updateMoneyBar();
            }
        });
    }
    undoBet(){
        this.amount+=this.bets[this.bets.length-1].amount;
        this.bets.pop();
        let betQueue = document.getElementById("betting-queue");
        betQueue.removeChild(betQueue.firstChild)
        this.updateMoneyBar()
    }
    clearBets(){
        this.amount += this.bets.reduce( (p, c) => p+c.amount, 0);
        this.bets=[];
        let betQueue = document.getElementById("betting-queue");
        betQueue.innerHTML=""
        this.updateMoneyBar()
    }

    updateMoneyBar(){
        document.getElementById("money-bar").innerHTML="RoialPoints: "+this.amount;
        setRP(this.amount);
    }
}


class Bet {
    constructor(player, amount, condition, payout){
        this.player = player;
        this.amount = amount;
        this.condition = condition;
        this.payout = payout;
    }
    winCondition(spinResult){
        if (this.condition.includes(spinResult)){
            return true;
        }
        else{
            return false;
        }
    }
}

function randomSpin(){
    // return 0
    return Math.floor(Math.random() * 38);
}

function bet(index){
    player.placeBet(betAmount, index);
    // console.log(VALID_BETS[]);
}

function playRound(randomNumber){
    let spinResult = randomNumber;
    console.log("Spin=", spinResult);
    setTimeout(function() {
        player.checkWins(spinResult);
        player.checkFunds();
    }, timer+200);
    
    
}

function changeBetAmount(){
    button = document.getElementById("changeBetSpan");
    if (betAmount == 10){
        button.innerHTML = 'Bet Amount: 50';
        betAmount=50;
    }
    else if (betAmount == 50){
        button.innerHTML = 'Bet Amount: 100';
        betAmount=100;
    }
    else {
        button.innerHTML = 'Bet Amount: 10';
        betAmount=10;
    }
    console.log(betAmount);
}

function coordMultiplier(string, multiplier){
    let numbers = (string.split(","));//.forEach(number => parseInt(number)*multiplier);
    for (let i=0; i<numbers.length; i++){
        numbers[i]=parseInt(numbers[i]*multiplier);
    }
    result="";
    numbers.forEach(number => result+=number+',');
    return result.slice(0,-1);
}

$(function() {
    $('.map').maphilight();
    let imageRatio = parseInt(document.getElementsByClassName('map')[0].style.width,10) /1148; //1148=original image width
    let tableAreas = document.getElementById('table-areas').children;
    for (let i=0; i< tableAreas.length; i++){
        tableAreas[i].coords= coordMultiplier(tableAreas[i].coords, imageRatio);
    }
});
getRP();
socket.on('recieveRP', RP =>{
   player= new Player("player", RP);
   player.updateMoneyBar();
})
var betAmount=10;

 