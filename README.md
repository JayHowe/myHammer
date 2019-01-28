# myHammer
原生JS ES6 实现简易版hammer插件
## 用法
  1. 引入
  ```js
        <script type="text/javascript" src="myHammer.js"></script>
  ```
  
  2. 实例化
   ```js
   //oBox必须是Dom对象
        let oBox=document.querySelector(".box");
        let hammer=new MyHammer(oBox);
   ```
   3. 事件监听使用
   ```js
        hammer.on('tap',()=>{
            console.log('tap');
        });

        hammer.on('press',()=>{
            console.log('press');
        });

        hammer.on('swipe',()=>{
            console.log('swipe');
        });

        hammer.on('swipeLeft',()=>{
            console.log('swipeLeft');
        });

        hammer.on('swipeRight',()=>{
            console.log('swipeRight');
        });


        hammer.on('swipeUp',()=>{
            console.log('swipeUp');
        });

        hammer.on('swipeDown',()=>{
            console.log('swipeDown');
        });


        hammer.on('pan',ev=>{
            console.log('pan');
            //console.log(ev.moveX);
            //console.log(ev.moveY);

        });

        hammer.on('panUp',ev=>{
            console.log('panUp');
        });
        hammer.on('panDown',ev=>{
            console.log('panDown');
        });

        hammer.on('panLeft',ev=>{
            console.log('panLeft');
        });
        hammer.on('panRight',ev=>{
            console.log('panRight');
        });

        hammer.on('pinch',ev=>{
            oBox.innerHTML=`pinch:${ev.test}`;
            console.log('pinch');
            oBox.style.transform=`scale(${ev.scale},${ev.scale}) rotate(${ev.rotate}deg)`;
        });

        hammer.on('pinchIn',ev=>{
            oBox.innerHTML=`pinchIn:${ev.test}`;
            console.log('pinchIn');
        });

        hammer.on('pinchOut',ev=>{
            oBox.innerHTML=`pinchOut:${ev.test}`;
            console.log('pinchOut');
        });
        hammer.on('pinchStart',ev=>{
            oBox.innerHTML=`pinchStart:${ev.scale}`;
        });
        hammer.on('pinchEnd',ev=>{
            oBox.innerHTML=`pinchStart:${ev.scale}`;
        });

        hammer.on('rotate',ev=>{
            oBox.style.transform=`scale(${ev.scale},${ev.scale}) rotate(${ev.rotate}deg)`;
        })
   ```
  
