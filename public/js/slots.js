window.onload = function() {
    
    var number1, number2, number3;
    var interval1;
    var chamber1 = document.getElementById("chamber1");
    var chamber2 = document.getElementById("chamber2");
    var chamber3 = document.getElementById("chamber3");
    var bet = 1;
    var rp = parseInt(document.getElementById("credits").innerHTML);


    document.getElementById("flip").onclick = function () {
        if (document.querySelector('.machine').style.transform != "rotateY(180deg)")
            document.querySelector('.machine').style.transform = "rotateY(180deg)";
        else {
            document.querySelector('.machine').style.transform = "rotateY(0deg)";
        }

    }
    
    document.getElementById("plus").onclick = function(){
        if (bet == 1)
            bet = 5;
        else if (bet == 5) 
            bet = 10;
        else if (bet < 50)
            bet += 10
        else {
            bet += 50
        }

        document.getElementById("bet").innerHTML = bet.toString();

    }

    document.getElementById("minus").onclick = function(){
        if (bet > 50)
            bet -= 50;
        else if (bet > 10) 
            bet -= 10;
        else if (bet == 10)
            bet = 5;
        else if (bet == 5) 
            bet = 1;
        document.getElementById("bet").innerHTML = bet.toString();

    }

    document.getElementById("play").onclick = function(){
        if (bet <= rp) {
            loseRP(bet);
            document.getElementById("plus").disabled = true;
            document.getElementById("minus").disabled = true;
            this.disabled = true;
            rp -= bet;
            document.getElementById('credits').innerHTML = rp;
            document.querySelector('.leverUpper').classList.add('smaller');
            setTimeout(function(){
                document.querySelector('.leverUpper').classList.remove('smaller');
            }, 1000);
            number1 = Math.floor(Math.random() * 10);
            number2 = Math.floor(Math.random() * 10);
            number3 = Math.floor(Math.random() * 10);

            count = 0;

            interval1 = setInterval(rolling, 100, chamber1);
            interval2 = setInterval(rolling, 100, chamber2);
            interval3 = setInterval(rolling, 100, chamber3);
        }
        
    };

    var count = 0;

    function rolling(elem) 
    {
        count++;
        index = Math.floor(Math.random() * 10);
        elem.setAttribute('src', '/img/slots/' + index + '.png')

        if (count == 60) {
            chamber1.setAttribute('src','/img/slots/' + number1 + '.png');
            clearInterval(interval1);
        }
        if (count == 70) {
            chamber2.setAttribute('src','/img/slots/' + number2 + '.png');
            clearInterval(interval2);
        }
        if (count == 75) {
            document.getElementById("play").disabled = false;
            document.getElementById("plus").disabled = false;
            document.getElementById("minus").disabled = false;
            getResult();
            clearInterval(interval3);
        }
        
    }

    function getResult() {
        var winnings = 0;
        chamber3.setAttribute('src', '/img/slots/' + number3 + '.png');
        let result = document.getElementById("result");
        if (number1 == number2 && number2 == number3) {
            if(number1 == 9) {
                winnings = bet * 100;
                result.innerHTML = winnings.toString()
            }
            else {
                winnings = bet * (number1 * 5 + 10)
                result.innerHTML = winnings.toString() + " ";
            }
        }

        else if (number1 == number2 || number1 == number3) {
            winnings = bet * (number1 + 1);
            result.innerHTML = winnings.toString() + " ";
        }

        else if (number2 == number3) {
            winnings = bet * (number2 + 1)
            result.innerHTML = winnings.toString() + " ";
        }

        else {
            result.innerHTML = winnings.toString() + " ";   
        }

        rp += winnings;
        document.getElementById("credits").innerHTML = rp;
        gainRP(winnings);

    }
}
