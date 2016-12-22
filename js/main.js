var game=(function(){
  let selected=false,
  time=0,
  timer;
  let images=[
    'https://kde.link/test/1.png',
    'https://kde.link/test/2.png',
    'https://kde.link/test/9.png',
    'https://kde.link/test/7.png',
    'https://kde.link/test/6.png',
    'https://kde.link/test/3.png',
    'https://kde.link/test/4.png',
    'https://kde.link/test/0.png',
    'https://kde.link/test/5.png',
    'https://kde.link/test/8.png'
  ],
  getXmlHttp=function() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
       try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
  },
  getJson=function(){
    document.getElementById('timeOfGame').classList.remove('winner');
    document.getElementById('container').innerHTML='';
    document.getElementById('container').style.display='block';
    document.getElementById('play').disabled=true;
    document.getElementById('stop').disabled=false;
    time=0;
    document.getElementById('timeOfGame').innerHTML='Your time: 00:00';
    timer=setInterval(function() {
      time+=1;
      document.getElementById('timeOfGame').innerHTML=
        'Your time: '+((Math.floor(time/60)<10)?'0':'')+
        Math.floor(time/60)+':'+(((time%60)<10)?'0':'')+
        (time%60);
    }, 1000);
    var xmlhttp = getXmlHttp(),
    massImages=[],randomItem;
    xmlhttp.open('POST', 'https://kde.link/test/get_field_size.php', false);
    xmlhttp.send(null);
    if (xmlhttp.responseText !='none'){
      var json=eval( '('+xmlhttp.responseText+')' );
      document.getElementById('container').style.width=json.width*104+'px';
      document.getElementById('container').style.height=json.height*104+'px';
      for(let i=0;i<json.width*json.height/2;i++){
        massImages.push(images[i%10],images[i%10]);
      }
      for(let i=0;i<json.width*json.height;i++){
        randomItem=Math.round(Math.random()*(massImages.length-1));
        createImg(massImages[randomItem]);
        massImages.splice(randomItem,1);
      }
    }
    else console.log('Fail connection');
  },
  stopGame=function(){
    document.getElementById('container').innerHTML='';
    document.getElementById('container').style.display='none';
    document.getElementById('play').disabled=false;
    document.getElementById('stop').disabled=true;
    clearInterval(timer);

  },
  winner=function(){
    stopGame();
    document.getElementById('timeOfGame').innerHTML='You are a winner! '+document.getElementById('timeOfGame').innerHTML;
    document.getElementById('timeOfGame').classList.add('winner');
  },
  createImg=function (item){
    let container=document.getElementById('container');
    container.innerHTML+=
      '<div class="noSelectedItem">'+
      '<img src="'+item+'" alt="'+item+'" />'+
      '</div>';
  },
  clickMe=function (e){
    let active=e.target;
    if(!e.target.src) active=e.target.getElementsByTagName('img')[0];
    if (active.parentNode.classList!='noSelectedItem') return false;

    if (selected==false){
      for(let i=0;i<document.getElementsByClassName('noSelectedItem').length;i++){
        document.getElementsByClassName('noSelectedItem')[i].classList.remove('selectedItem');
      }
    }
    active.parentNode.classList.add('selectedItem');
    if (!selected) selected=active;
    else{
      if (selected.src==active.src){
        selected.parentNode.classList.remove('noSelectedItem');
        selected.parentNode.classList.remove('selectedItem');
        active.parentNode.classList.remove('noSelectedItem');
        active.parentNode.classList.remove('selectedItem');
        selected.parentNode.classList.add('removedItem');
        active.parentNode.classList.add('removedItem');
        if (document.getElementsByClassName('noSelectedItem').length==0) winner();
      }
      selected=false;
    }
  };
  return {
    start:getJson,
    clickMe:clickMe,
    stop:stopGame
  }
})();

document.getElementById('container').addEventListener("mousedown", game.clickMe);