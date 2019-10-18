import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import * as cocoSsd from "@tensorflow-models/coco-ssd";

 
class App extends Component {
  
  canvasRef = React.createRef();

  constructor(props){
    super(props)
    // this.videoRef = React.createRef();
    // this.canvasRef = React.createRef();
  }

  componentDidMount=async()=> {
    //navigator.mediaDevices.getUserMedia asks user to provide access to videoplayer and audio for user
    //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 
    const constraints= { audio: true, 
      // facingMode: user is selected for mobile devices, otherwise it would be video: { facingMode: { exact: "environment" } } for the rear
      // video: { facingMode: "user" }
      video: { facingMode: "user" }
      
    }
console.log(navigator)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      
      try{ 
        var video = document.querySelector('video');
        
        // var enumeratorPromise =await navigator.mediaDevices.enumerateDevices().then(function(devices){
        //   let r=devices.filter(i=>i.kind==='videoinput')
        //   // devices.forEach(function(dev){
        //    console.log(r)
        //    alert(r[0].label)
        // //  })
        // }
          
        // );
        // console.log(enumeratorPromise)
        

        const webCamReturn= await navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream=>{
          
          console.log(mediaStream)
          console.log(mediaStream.kind)
          video.srcObject = mediaStream;
          //basically if it loaded, then play
          video.onloadedmetadata = function(e) {
          video.play();
          };
        });


        const modelPromise = await cocoSsd.load();

        video.onloadeddata=()=>{
          Promise.all([modelPromise, webCamReturn])
          .then(values => {
            // console.log(values)
            // this.detectFrame(this.videoRef.current, values[0]);
            
            this.detectFrame(video, values[0]);
          })
          .catch(error => {
            console.error(error);
          });
        }
       


      }
      catch(e){
        console.warn(e)
      }
     
    }
    else{
      console.log('problems accessing video')
    }
  }


     
      detectFrame = (video, model) => {

        // console.log(video)
        // requestAnimationFrame(() => {
        //         this.detectFrame(video, model);
        //       });
          // if(video.onloadeddata){
            // console.log('vide loaded')
            model.detect(video).then(predictions => {
              // if(video.onloadeddata=(e)=>({
                this.renderPredictions(predictions);
                // requestAnimationFrame is a callback function which repaints the animation, aka makes video recheck for renderPredicitons
                requestAnimationFrame(() => {
                  this.detectFrame(video, model);
                });
              })
          // }else{
          //   console.log('no viod')
          //   requestAnimationFrame(() => {
          //     this.detectFrame(video, model);
          //   });
            
          // }
       
          
          // });
        
       
      }
      
    
      renderPredictions = predictions => {
        var canvas = document.querySelector('canvas');
        // const ctx = this.canvasRef.current.getContext("2d");
        const ctx = canvas.getContext("2d");
        
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Font options.
        const font = "20px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "hanging";
        
        predictions.forEach(prediction => {
          const x = prediction.bbox[0];
          const y = prediction.bbox[1];
          const width = prediction.bbox[2];
          const height = prediction.bbox[3];
          // console.log(prediction)
          // Draw the bounding box.
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 5;
          ctx.strokeRect(x, y, width, height);
          // Draw the label background.
          ctx.fillStyle = "#00FFFF";
          
          const textWidth = ctx.measureText(prediction.class).width;
          const textHeight = parseInt(font, 10); // base 10
          // console.log(textWidth)
          // console.log(textHeight)
          ctx.fillRect(x, y, textWidth+5, textHeight + 4);
        });
    
        predictions.forEach(prediction => {
          const x = prediction.bbox[0];
          const y = prediction.bbox[1];
          // Draw the text last to ensure it's on top.
          ctx.fillStyle = "#000000";
          ctx.fillText(prediction.class, x, y);
          // ctx.fillText(`${prediction.class} and ${prediction.score}`, x, y);
        });
      

      }
  

  render(){

    return (
      <div className="App">
        <video
          className="size"
          autoPlay
          playsInline
          muted
          width="600"
          height="500"
          ref={this.videoRef}
          // width="600"
          // height="500"
          
        />
          <canvas
          className="size"
          width="600"
          height="500"
          // border= "2px solid blue"
          // border= '2px solid blue'
          // ref={this.canvasRef}
          // width="600"
          // height="450"
          // width='600'
        />
         
      </div>
    );
  }
 
}

export default App;
