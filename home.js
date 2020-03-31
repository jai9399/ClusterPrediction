
let trainingData=[]
let model;
let state ='collection'
let set_key = 'Q'
function setup(){
    var canvas = createCanvas(600,600);
    const options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: true,
        learningRate:0.7
      }
    model = ml5.neuralNetwork(options);
}
function draw(){
  
    
}
function keyPressed(){
    set_key = key.toUpperCase();
    if(set_key == 'L'){
       fetch('./data.json').then(function(resp){
           return resp.json()
       }).then(function(data){
           console.log(data)
           presentData(data);
       });
       model.loadData('data.json')
    }
    else if(set_key == 'M'){
        model.save()
    }
    else if(set_key=='R'){
        const modelDetails = {
            model: './model.json',
            metadata: './model_meta.json',
            weights: './model.weights.bin'
          }
          model.load(modelDetails, modelLoaded)
          state='prediction'
        }
    else if(set_key == 'S'){
            model.saveData('data')
        }    
    else if(set_key == 'T'){
            model.normalizeData();
            const options={
                epochs:200
            }
            model.train(options,whileTraining,finishedTraining)
        }
}
function presentData(data){
    data.data.forEach(obj=>{
    stroke(0);
    noFill();
    ellipse(obj.xs.x,obj.xs.y,24)
    fill(0);
    noStroke();
    textAlign(CENTER,CENTER)
    text(obj.ys.label,obj.xs.x,obj.xs.y)
    })
}
function mousePressed(){
    let inputs = {
        x: mouseX,
        y: mouseY
      };
    
      if (state == 'collection') {
        let target = {
          label: set_key
        };
        model.addData(inputs, target);
        stroke(0);
        noFill();
        ellipse(mouseX, mouseY, 24);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(set_key, mouseX, mouseY);
    
      } else if (state == 'prediction') {
        model.classify(inputs, gotResults);
      }
}
function whileTraining(epoch,loss){
    console.log(epoch)
    console.log(loss)
}
function finishedTraining(){
    console.log('Done')
    state = 'prediction'
    set_key='Q'
}
function gotResults(error,result){
    if(error){
        console.log(error)
        return;
    }
    else{
        stroke(0);
        fill(10)
        ellipse(mouseX, mouseY, 24);
        fill(255,255,255);
        stroke(255,255,255);
        textAlign(CENTER, CENTER);
        text(result[0].label, mouseX, mouseY);
    }
    
}
function modelLoaded(){
    console.log('Loaded Model')
}