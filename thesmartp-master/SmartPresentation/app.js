
// --------------------모듈---------------------------------------------------------------
var rimraf = require("rimraf");
const fs = require('fs')
var url =require('url')
const PDF2Pic = require("pdf2pic");
const libre = require('libreoffice-convert');
const express = require('express')
const socket = require('socket.io')
var multer = require('multer')
const path = require('path')
const makeDir = require('make-dir')
const read = require('read-file')
const extend = '.pdf';
var ip = require("ip");
// --------------------모듈---------------------------------------------------------------










let room=["room0","room1","room2","room3","room4","room5"]
var ip = ip.address();


var _storage = multer.diskStorage({
    destination: function(request, file, cb) {
        cb(null, './uploads')
        
    },
    filename: function(request, file, cb){
        cb(null, file.originalname)
    }  
})



var upload = multer({ storage: _storage})


//내장 모듈
const http = require('http');
const { stringify } = require("querystring");

// express 객체 생성
const app = express()

//http 서버 생성
const server = http.createServer(app)

//생성된 서버를 socket.io에 바인딩
const io = socket(server)


//----------------------------------미들웨어----------------------------------------
app.use('/user', express.static('uploads'))
app.use('/user', express.static('output'))
app.use('/user', express.static('png'))
app.use('/user', express.static('images'))


app.use('/lock/user', express.static('png'))
app.use('/lock', express.static('assets/css'))
app.use('/lock/assets/css', express.static('assets/css'))
app.use('/lock/assets/js', express.static('assets/js'))

app.use('/slide/assets/css', express.static('assets/css'))
app.use('/slide/user', express.static('png'))
app.use('/slide/assets', express.static('assets'))
app.use('/slide/assets/js', express.static('assets/js'))



app.use('/question/user',express.static('png'))
app.use('/question/assets/css', express.static('assets/css'))
app.use('/question/assets', express.static('assets'))
app.use('/question/assets/js', express.static('assets/js'))
app.use('/question/user',express.static('images'))

app.use('/assets/fonts',express.static('assets/fonts'));
app.use("/assets/css",express.static('assets/css'))
app.use("/assets/js",express.static('assets/js'))
app.use('/images',express.static('images'));

app.use('/delete_page',express.static('images'))
//----------------------------------미들웨어----------------------------------------





//---------------------------------템플릿엔진----------------------------------------
app.set("view engine","pug");
app.set("views","./views")
app.locals.pretty = true; 
//---------------------------------템플릿엔진----------------------------------------





//------------------------------------------------기타 함수----------------------------------------
function listfy(list_){
    
    var list_done=[]
    var i =0;
    while(i < list_.length){
        var temp2 = list_[i].split('.pdf');
        list_done[i] = temp2[0];
        i = i + 1;
    }
    return list_done
}

function findorder(name,list){
    var i = 0;
    while(i<list.length){
        if(name==list[i]){
            return i
        }
        i=i+1;
    }
}        
//------------------------------------------------기타 함수----------------------------------------







//-------------------------------------------------로그인접근---------------------------------------
app.get('/',function(request,response){
    fs.readFile('./assets/index.html',function(err,data){
      
        if(err){
            response.send('에러')
        }else{
            response.writeHead(200)
            response.write(data);
            response.end()
        }
    }) 
})
//-------------------------------------------------로그인접근---------------------------------------






//-------------------------------------------------메인화면-----------------------------------------
app.get('/index.html',function(request,response){
     var pre = request.headers.referer;
    
     if(pre == undefined)
     {
        //  fs.readFile('./assets/login.html',function(err,data){
     
        //      if(err){
        //          response.send('에러')
        //      }else{
        //          response.writeHead(200)
        //          response.write(data);
        //          response.end()
        //      }
        //  }) 
     }  
     else
     {
        //  var address = request.originalUrl;
        //  var temp = address.split('?');
        //  var gid = temp[1];
        //  var output = 'output/';
        //  var directory = output.concat(gid);
        //  (async () =>{
        //      const path = await makeDir(directory);
        //  })();
        fs.readFile('./assets/index.html',function(err,data){
            if(err){
                response.send('에러')
            }else{
                response.writeHead(200)
                response.write(data);
                response.end()
            }
        }) 
     }
})
//-------------------------------------------------메인화면-----------------------------------------




//------------------------------------------------발표자료 업로드--------------------------------------
app.post('/upload', upload.single('userfile'), function(request,response){
    
    // console.log(request.file);
    // var address = request.headers.referer;
    // var temp = address.split('?');
    // var gid = `/${temp[1]}`;
    // var output = 'output/';
    // var directory = output.concat(gid);

    var directory = './output';
    var gid ='';
    address = 'index.html'
    
    
    

    fs.readFile(`/uploads/${request.file.filename}`,'utf8',function(err,data){
        console.log(data);
    })


    console.log(__dirname)
    const enterPath = path.join('./uploads', request.file.filename);
    const outputPath = path.join(__dirname, `/output${gid}/${request.file.filename}${extend}`);

    const enterPath1 = fs.readFileSync(enterPath);

    libre.convert(enterPath1, extend, undefined, (err, done) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
        }
     
        fs.writeFileSync(outputPath, done);
        console.log(outputPath)
    });


    setTimeout(function(){const pdf2pic = new PDF2Pic({
        density: 100,           // output pixels per inch
        savename: `${request.file.filename}`,   // output file name
        savedir: `./png/${request.file.filename}`,    // output file location
        format: "png",          // output file format
        size: "600x600"         // output size in pixels
      });

    pdf2pic.convertBulk(outputPath, -1).then((resolve) => {
        console.log("image converter successfully!");
        fs.writeFile(`./png/${request.file.filename}/__data.txt`,'',function(err){
            if(err){
                console.log("failed")
            }else{
               
                console.log("done")
            }
        })
        response.statusCode = 302;
        response.setHeader('Location', address);
        response.end();
        return resolve;
    });},8000);

}).listen(51112, "127.0.0.1");
//------------------------------------------------발표자료 업로드-----------------------------------





//--------------------------------------------------발표시작하기--------------------------------------
app.get('/start.html',function(request,response){
    //  var address = request.headers.referer;
    //  if(address == undefined)
    //  {
    //      response.statusCode = 302;
    //      response.setHeader('Location', 'http://thesmartp.com:8000');
    //      response.end()
    //  }
    //  var temp = address.split('?');
    //  var gid = temp[1];
    //  var output = './output/';
    //  var directory = output.concat(gid);

    var directory = './output'

    fs.readdir(directory,function(err,list){

        response.render("start",{list:listfy(list),length:listfy(list).length})
    })  
})




app.get('/slide',function(request,response){
               
    var queryData = url.parse(request.url,true).query
    console.log(queryData.id)
    
    
    fs.readdir('./png',function(err,list){  
        num=findorder(queryData.id,list);
        console.log(num)

        fs.readdir(`./png/${queryData.id}`,function(err,list){
  
            response.render("slide",{queryData:queryData.id , roomnum:num , rooms:room , length:list.length , ipAddress:ip})
        })
    }) 
})



app.get('/lock',function(request,response){
               
    var queryData = url.parse(request.url,true).query
    console.log(queryData.id)

    slide='';
    
   

    

    fs.readdir('./png',function(err,list){  
	var order = findorder(queryData.id,list);       

 
        fs.readdir(`./png/${queryData.id}`,function(err,list){

            for(i=1;i<list.length;i++){
                slide=slide+`<li>
                        <input type="checkbox" name="cb" id="myCheckbox${i}" />
                        <label for="myCheckbox${i}"><img src="./user/${queryData.id}/${queryData.id}_${i}.png" /></label>
                        </li>`
            }
            template=`<html>
                <head>
                    <link rel="stylesheet" type="text/css" href="./assets/css/lock.css" />
   		    <link rel="stylesheet" type="text/css" href="./assets/css/header.css" />
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
                    <script src="/socket.io/socket.io.js"></script> 
                </head>
                <body>
                   <header id="header">
		   	<a class="logo" href="/">The Smart Presentation</a>
			<button id="submit">submmit</button> 
		   </header>
                    <ul>
                        ${slide} 
                    </ul>

                    

                    <script>
			
			var socket=io()
			var num=${order}

                        document.getElementById("submit").onclick=function(){
                            var string='';
                            $("input[name='cb']").each(function(){
                                if(this.checked == true){
                                    console.log('1');
                                    string=string+1;
                                }else{
                                    console.log("0")
                                    string=string+0;
                                }
                            })
                            console.log(string);
  			    socket.emit("checked",string,num);
			    alert("Done.")
			    location.href = "/slide/?id=${queryData.id}"
                        }
                    </script>
                    
                </body>
              </html>`;
            response.writeHead(200)
            response.end(template)
        })   

    }) 

})

//--------------------------------------------------발표시작하기--------------------------------------






//--------------------------------------------------발표자료 삭제-----------------------------------------
app.get('/delete.html',function(request,response){
    //  var address = request.headers.referer;
    //  if(address == undefined)
    //  {
    //      response.statusCode = 302;
    //      response.setHeader('Location', 'http://thesmartp.com:8000');
    //      response.end()
    //  }
    //  var temp = address.split('?');
    //  var gid = temp[1];
    //  var output = './output/';
    //  var directory = output.concat(gid);
    var directory = './output';

    fs.readdir(directory,function(err,list){

        response.render("delete",{list:listfy(list),length:listfy(list).length})
    })  
})



app.get('/delete',function(request,response){
    // var address = request.headers.referer;
    // var temp = address.split('?');
    // var gid = `/${temp[1]}`;
    var gid = '';
    var address='/delete.html'

    

    var queryData = url.parse(request.url,true).query
    console.log(queryData.id)
    rimraf(`./png/${queryData.id}`, function(err,data){ 
        if(err){
            console.log(err)
        }else{
            fs.unlink(`./output${gid}/${queryData.id}.pdf`,function(err,data){
                if(err){
                    console.log(err)
                }else{
                    fs.unlink(`./uploads/${queryData.id}`,function(err,data){
                        if(err){
                            console.log(err)
                        }else{
                            console.log("all deleted")
                        }
                    })
                }
            })
            response.writeHead(302,{'Location':address})
            response.end()
        }
    })
})
//--------------------------------------------------발표자료 삭제-----------------------------------------












// -------------------------------------------------------청중용----------------------------------------------------
app.get('/question',function(request,response){

    var queryData = url.parse(request.url,true).query
    console.log(queryData.id)

    fs.readdir('./png',function(err,list){

        var roomnum = findorder(queryData.id,list)
        var path = './png/';
        path = path.concat(queryData.id);
        path = path.concat('/__data.txt');
        var lockinfo = read.sync(path, 'utf8');


        fs.readdir(`./png/${queryData.id}`,function(err,list){
            
            var slide=``
            var i=1;
            while(i<list.length){
		//unlock
                if(lockinfo[i-1]=='0'){
                        slide=slide+`<div class="swiper-slide"><img src="./user/${queryData.id}/${queryData.id}_${i}.png"></div>`
                        console.log(lockinfo[i-1]);
                }
                //lock
                else{
                        slide=slide+`<div class="swiper-slide"><img src="/user/lock.png"></div>`
                        console.log(lockinfo[i-1]);
                }
                i=i+1; 
            }
            template=`
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Smart Presentation</title>
    <!-- Link Swiper's CSS -->
    <link rel="stylesheet" href="./assets/css/swiper.min.css">
    <link rel="stylesheet" href="./assets/css/headstyle.css">
    <link rel="stylesheet" href="assets/css/main.css" />
    <link rel="stylesheet" href="assets/css/start.css" />
   
     <script>
            //F12 키 방지
            (function(){
              document.addEventListener('keydown', function(e){
                const keyCode = e.keyCode;
                if(keyCode == 123){ // F12 key
                    e.preventDefault();
                    e.returnValue = false;
                }
              })
            })();
           //우클릭 방지
           (function(){
              document.addEventListener('contextmenu', function(e){
                        e.preventDefault();
                        e.returnValue = false;
              })
            })();

   </script>
 
    <script src="/socket.io/socket.io.js"></script>
    <!-- Demo styles -->
    <style>
        #test{
            width: 200px;
            height:50px;
        }
        div {
            margin: 0px;
            padding: 0px;
            text-align: right;
        }
        html,
        body {
            position: relative;
            height: 100%;
        }
        body {
            background: #eee;
            font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #000;
            margin: 0;
            padding: 0;
        }
        #content {
            margin: 0px;
            border: 0px;
            display: flex;
            height: 100%;
        }
        #_content {
            height: 50px;
            width: 100%;
        }
        #__content {
            height: 690px;
            width: 100%;
        }
        #aside {
            flex: 0.5;
            height: 50px;
        }
        #_heading {
            flex: 4.5;
            height: 50px;
        }
        .swiper-container {
            width: 100%;
            height: 100%;
        }
        .swiper-slide {
            text-align: center;
            font-size: 18px;
            background: #fff;
            /* Center slide text vertically */
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
        }
    </style>
    <style type="text/css">
        img {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        img {
            display: block;
        }
        img {
            border: none;
            vertical-align: top;
        }
    </style>
    <style>
        #main {
            margin: auto;
            /* border-top: 20px solid black; */
            border-radius: 5px;
            background-color: #CCCCCC;
            text-align: center;
            text-decoration-color: black;
            width: 100%;
            height: 100%;
            
    
        }
    
        /* 채팅 영역 */
        #chatting{
            display:flex;
            flex-direction: column;
        }
        #chat {
	    height:84%;
            width: 100%;
            overflow-y: auto;
        }
        #btn{
            flex-bias:20%
        }
        .chatting{
            display:flex;
            flex-direction: column-reverse;
            height: 100%;
        }
        .chatbox{
            height: 90%;
        }
        .sending{
            height: 10%;
            
        }
    </style>
</head>
<body>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script>
    <script src="./assets/js/headindex.js"></script>
    
    <div id="content">
                <!-- Swiper -->
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        ${slide}
                        
                    </div>
                </div>  
                
                
                <div class="chatting">
                    <div id="main">
                        <div id="chat">
                            <!-- 채팅 메시지 영역 -->
                        </div>
                        <div id="btn">
                            <input type="text" id="test" placeholder="메시지를 입력해주세요.."> 
                            <button onclick="send()">전송</button>
                            <button id="sync">Sync</button>
                        </div>
                    </div>
                <div>
    </div>
    
    <script>
                        var socket = io()
                        var num =${roomnum} 
                        console.log("room number"+${roomnum})
                        /* 접속 되었을 때 실행 */
                        socket.on('connect', function() {
                            /* 이름을 입력받고 */
                            var name = prompt('반갑습니다!', '')
                            
                            /* 이름이 빈칸인 경우 */
                            if(!name) {
                                name = '익명'
                            }
                            
                            /* 서버에 새로운 유저가 왔다고 알림 */
                            socket.emit('newUser', name)
                            socket.emit('joinRoom', num)
                            
                            })
                        
                        /* 서버로부터 데이터 받은 경우 */
                        socket.on('update', function(data) {
                        var chat = document.getElementById('chat')
                        
                        var message = document.createElement('div')
                        var node = document.createTextNode(data.name+":"+data.message)
                        var className = ''
                        
                        // 타입에 따라 적용할 클래스를 다르게 지정
                        switch(data.type) {
                            case 'message':
                            className = 'other'
                            break
                        
                            case 'connect':
                            className = 'connect'
                            break
                        
                            case 'disconnect':
                            className = 'disconnect'
                            break
                        }
                        
                        message.classList.add(className)
                        message.appendChild(node)
                        chat.appendChild(message)

                        var scroll = document.getElementById("chat");
                        scroll.scrollTop = scroll.scrollHeight;
                        })
                        
                        
                        /* 메시지 전송 함수 */
                        function send() {
                        // 입력되어있는 데이터 가져오기
                        var message = document.getElementById('test').value
                        
                        // 가져왔으니 데이터 빈칸으로 변경
                        document.getElementById('test').value = ''
                        
                        // 내가 전송할 메시지 클라이언트에게 표시
                        var chat = document.getElementById('chat')
                        var msg = document.createElement('div')
                        var node = document.createTextNode(message)
                        msg.classList.add('me')
                        msg.appendChild(node)
                        chat.appendChild(msg)
                        
                        // 서버로 message 이벤트 전달 + 데이터와 함께
                        socket.emit('message', {type: 'message', message: message},num)
                        
                        }
                        
                        socket.on('synchro' ,function(data){
                                var page = data;
                                // console.log(data.message);
                                document.getElementById('sync').onclick=function(){
                                    mySwiper.slideTo(data.message-1);
                                };
                                
                                // mySwiper.slideTo(data.message-1);
                        })  
                        
                                       
                        
                       
                        </script>
    <!-- Swiper JS -->
    <script src="./assets/js/swiper.min.js"></script>
    <!-- Initialize Swiper -->
    <script>
        var swiper = new Swiper('.swiper-container');
        
    </script>
    <script>
        var mySwiper = document.querySelector('.swiper-container').swiper
        
        
    </script>
</body>
</html>`;

            response.writeHead(200)
            response.end(template)
        })
    }) 
})


//---------------------------------------------------------------------


io.sockets.on('connection', function(socket){

    //새로운 유저가 접속 했을 경우 다른 소켓에도 알림
    socket.on('newUser',function(name){
        console.log(name + ' logged in.')
        //소켓에 이름 저장 해두기
        socket.name = name

        //모든 소켓에게 전송
        // io.sockets.emit('update',{type: 'connect', name: 'SERVER',message: name + '님이 접속하였습니다. '})
    })
    socket.on('joinRoom',function(num){
        socket.join(room[num]);
    })
    //전송한 메세지 받기
    socket.on('message',function(data,num){
        // 받은 데이터에 누가 보냈는지 이름을 추가
        data.name = socket.name

        console.log(data)

        //보낸 사람을 제외한 나머지 유저에게 메세지 전송
        socket.to(room[num]).emit('update',data);
        
    })


    socket.on("checked",function(data,room){
        console.log( "data has been arrived "+data+" from room "+room)
        fs.readdir('./png',function(err,list){
            var ppt = list[room];
            var text = new Uint8Array(Buffer.from(data));
            if(err){
                throw err;
            }
            else{
                fs.writeFile(`./png/${ppt}/__data.txt`,text,function(err){
                    if(err){
                        console.log("failed")
                    }else{
                       
                        console.log("success")
                    }
                })
            }
        })          
    })

// 바뀐부분 #################################################################################################
    socket.on('slidechange',function(data,num){
            var slidenum = data.message;
            var roomnumber = num;
            socket.to(room[roomnumber]).emit('synchro',data);
            console.log(`slide is ${slidenum} and room number is ${roomnumber}`)
            
    })
// 바뀐부분 #################################################################################################





    //접속 종료
    socket.on('disconnect', function(num){
        console.log(socket.name + '님이 나가셨습니다.')
        socket.leave(room[num]);
        //나가는 사람을 제외한 나머지 유저에게 전송
        socket.to(room[num]).emit('update',{type: 'disconnect',name:'SERVER',message: socket.name+ '님이 나가셨습니다.'})
     })
})

    

//서버를 8080 포트로 listen
server.listen(8000, function(){
    console.log('server is running..')
})
