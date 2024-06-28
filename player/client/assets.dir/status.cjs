

   function round ( number, decimal=3 )
   {
       let output = (number.toFixed(decimal) * 1);
       return output;
   };

   Object.defineProperty(globalThis,'Busy',{writable:false,enumerable:false,configurable:false,value:(new EventTarget())});
   Busy.base = {skin:document.getElementById('busyPane').getAttribute('style'), gear:document.getElementById('busyPane').innerHTML};
   Busy.node = null;
   Busy.jobs = {};
   Busy.data = 0;
   Busy.size = 5;
   Busy.actv = 0;

   Busy.edit = function(k,v,  n,j,t,l,i,d,m,p,u,g,a)
   {
      if(((typeof k)!='string')||(k.length<1)||((typeof v)!='number')){return};
      if(!Busy.node){Busy.init(k,v); return};
      Busy.dead=false;
      n=Busy.node; Busy.jobs[k]=((v>100)?100:v); j=Busy.jobs; l=0; t=((Object.getOwnPropertyNames(j)).length*100);
      for(i in j){if(j.hasOwnProperty(i)){l+=j[i];}}; d=Math.floor((l/t)*100); n.style.opacity=1; //n.focus();
      Busy.data=d; m=Math.floor(d/10); g=n.getElementsByClassName('pgrp')[0]; p=g.getElementsByTagName('path');
      i=null; for(i in p){if(p.hasOwnProperty(i)){u=(p[i].getAttribute('name')*1); p[i].style.opacity=((u<=m)?1:0.5);}};
      if(d>0){a=g.getElementsByTagName('animateTransform')[0]; if(a){a.parentNode.removeChild(a);}};
      if(d>99){Busy.done()};
   };


   Busy.tint = function(c,  n,l,f,i)
   {
      if(!Busy.node){return}; n=Busy.node;
      n.style.opacity=1; l=n.getElementsByClassName('line'); f=n.getElementsByClassName('fill');
      for(i in l){if(l.hasOwnProperty(i)){l[i].style.stroke=c;}}; i=null;
      for(i in f){if(f.hasOwnProperty(i)){f[i].style.fill=c; f[i].style.fillOpacity=0.5;}};
   };


   Busy.done = function(p,w,x,o,f,t,n,p)
   {
      p=document.getElementById('busyPane'); if(!p||!Busy.node){return;}; Busy.jobs={}; Busy.dead=true;
      w=(Busy.fail?'fail':'done');
      n=Busy.node; n.style.opacity=1; x=100; o=1; f=round(((o/x)*5),3); p=n.parentNode;
      setTimeout(function()
      {
         t=setInterval(function()
         {
            if(!Busy.dead){clearInterval(t); p.style.opacity=1; return}; o-=f; if(o>0){p.style.opacity=o; return};
            clearInterval(t); p.style.opacity=0; p=document.getElementById('busyPane');
            if(p&&p.parentNode){p.parentNode.removeChild(p)};
            Busy.fail=false; Busy.node=null; n=null; p=null; Busy.data=0;
            setTimeout( ()=>{Busy.actv=0}, 150 );
         },5);
         setTimeout(()=>
         {
            if(Busy.dead&&document.getElementById('busyPane')){Busy.stop()};
            if (!!Busy.root){ Busy.root.style.display = "none" };
         },1250);
      },260);
   };


   Busy.init = function(j,v,  ap,sb)
   {
      sb=true;
      Busy.base.skin=Busy.base.skin.split("display:none").join("display:block");

      if (!!Busy.root){ Busy.root.style.display = "block" };

      if(!!Busy.node){Busy.node.style.opacity=1; Busy.edit(j,(v||0)); return};
      var p=document.createElement('div'); p.id='busyPane';
      p.setAttribute('style',Busy.base.skin); p.innerHTML=Busy.base.gear; document.body.appendChild(p);
      Busy.node=document.getElementById('busyGear'); let s=Busy.size; if((s*1)==s){s+='rem'};
      Busy.node.style.width=s; Busy.node.style.height=s; Busy.node.style.opacity=1; Busy.node.setAttribute('tabindex',-1);
      Busy.node.tabindex=-1; Busy.node.style.outline='none'; Busy.actv=1; Busy.edit(j,(v||0));
   };


   Busy.stop = function()
   {
      Busy.jobs={}; Busy.dead=true; Busy.fail=false; Busy.node=(function(){}());
      let p=document.getElementById('busyPane'); if(!p){return}; p.parentNode.removeChild(p);
      if (!!Busy.root){ Busy.root.style.display = "none" };
   };


   Busy.stop();
   // Busy.init("boot",1);
   // Busy.edit("boot", 100);
