let blackjackgame = {
    'you' : {'scorespan' : '#your_score' , 'div':'#your_box' ,'score':0},
    'dealer' :{'scorespan' : '#bot_score' , 'div':'#bot_box' ,'score':0},
    'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsmap':{'2': 2,'3': 3,'4':4,'5': 5,'6': 6,'7': 7,'8': 8, '9':9,'10':10,'K':10,'Q':10,'J':10,'A':1},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnsover':false,
};

const YOU = blackjackgame['you'];
const DEALER = blackjackgame['dealer'];
const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const losssound = new Audio('sounds/aww.mp3');


document.querySelector('#hit').addEventListener('click',blackjackhit);
document.querySelector('#stand').addEventListener('click',dealerlogic);
document.querySelector('#deal').addEventListener('click',blackjackdeal);

function randomcard(){
    let num = Math.floor(Math.random()*13);
    return blackjackgame['cards'][num];
}

function showcard(card,activeplayer){
    if(activeplayer['score'] <= 21){
        let cardimage = document.createElement('img');
        cardimage.src = `images/${card}.png`;
        cardimage.width = 90;
        cardimage.style.margin = "5px 5px";
        document.querySelector(activeplayer['div']).appendChild(cardimage);
        hitsound.play();
    }
}

function blackjackhit(){
    if(blackjackgame['isStand'] === false){
        let card=randomcard();
        showcard(card,YOU);
        updatescore(card,YOU);
        showscore(YOU);
    }   
}

function blackjackdeal(){
    if(blackjackgame['turnsover'] === true){
        blackjackgame['isStand'] = false;
        let yourimages = document.querySelector('#your_box').querySelectorAll('img');
        let dealerimages = document.querySelector('#bot_box').querySelectorAll('img');
        for(i=0;i<yourimages.length;i++){
            yourimages[i].remove();
        }
        for(i=0;i<dealerimages.length;i++){
            dealerimages[i].remove();
        }

        YOU['score']=0;
        DEALER['score']=0;

        document.querySelector('#your_score').textContent=0;
        document.querySelector('#your_score').style.color='white';
        document.querySelector('#bot_score').textContent=0;
        document.querySelector('#bot_score').style.color='white';

        document.querySelector('#result').textContent="C'mon!";
        document.querySelector('#result').style.color='black';
    }

    blackjackgame['turnsover']=false;
}

function updatescore(card,activeplayer){
        activeplayer['score']+=blackjackgame['cardsmap'][card];
}

function showscore(activeplayer){
    if(activeplayer['score'] > 21){
        document.querySelector(activeplayer['scorespan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scorespan']).style.color = 'red';
    }
    else{
        document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];
    }    
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerlogic(){

    blackjackgame['isStand'] = true;

    while(DEALER['score']<16 && blackjackgame['isStand']===true){
        let card = randomcard();
        showcard(card,DEALER);
        updatescore(card,DEALER);
        showscore(DEALER);
        await sleep(500);
    }

    blackjackgame['turnsover'] = true;
    showresult(findwinner());

}

//fins winner and update the table
function findwinner(){
    let winner;

    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || (DEALER['score']>21)){
            blackjackgame['wins']++;
            winner=YOU;
        }
        else if(YOU['score'] < DEALER ['score']){
            //dealer wons
            blackjackgame['losses']++;
            winner=DEALER;
        }
        else if(YOU['score'] === DEALER['score']){
            console.log('draw');
            blackjackgame['draws']++;
        }
    }
    //when you bust but the dealer doesnt 
    else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackgame['losses']++;
        winner=DEALER;
    }
    else if(YOU['score'] > 21 && DEALER['score'] > 21){
        console.log('drew');
        blackjackgame['draws']++;
    }

    console.log('winner is' , winner);
    return winner;
    
}

function showresult(winner){

    let msg , msgcolor;
    if(blackjackgame['turnsover'] === true){
        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackgame['wins'];
            msg = 'You won!';
            msgcolor='green';
            winsound.play();
        }

        else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackgame['losses'];
            msg = 'You lost!';
            msgcolor='red';
            losssound.play();
        }
        else{
            document.querySelector('#draws').textContent = blackjackgame['draws'];
            msg='Draw!';
            msgcolor='black';
        }

        document.querySelector('#result').textContent=msg;
        document.querySelector('#result').style.color = msgcolor;
    }
}