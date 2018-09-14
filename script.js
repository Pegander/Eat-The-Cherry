//Vänta till DOM har laddats för att köra scriptet
window.addEventListener("DOMContentLoaded", function() {
    //Hämta canvas och skapa variabel för att använda till att rita på canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    
    //Skapa klass för spelare och ge ett antal värden i constructor
    class player {
        constructor(){
            this.xpos = 0;
            this.ypos = 0;
            this.heigth = 50;
            this.width = 50;
            //Status och score initieras för att kunna användas senare
            this.status = "alive"
            this.score = 0;
        }
        //Metod för att måla upp spelare
         draw(){
            this.image = document.getElementById("playerImage");
            ctx.drawImage(this.image, this.xpos, this.ypos);
        }
    }
       
//Funktion för att flytta spelaren
    function move(event){
        //Se vilken knapp spelaren trycker på och flytta spelaren i rätt riktning
        var keypressed = event.key;
        //Flytta bara spelaren om spelarens status är alive
        if(player1.status=="alive"){
            if(keypressed == "ArrowRight" && player1.xpos<550){
                player1.xpos += 25;
            }
            //Flytta spelarn om denna inte nått gränsen av min canvas
            else if(keypressed == "ArrowLeft" && player1.xpos>0){
                player1.xpos -= 25;
            }
            else if(keypressed == "ArrowDown" && player1.ypos<350){
                player1.ypos += 25;
            }
            else if(keypressed == "ArrowUp" && player1.ypos>0){
                player1.ypos -= 25;
                }
        }
        //Om spelaren inte är alive sätt positionen x och y till 0 för att undvika att spelaren kan fortsätta plocka poäng efter dennes död
        else{
            player1.xpos = 0;
            player1.ypos = 0;
        }
        
    } 
    //Skapa klass för motståndare, heter obstacle för att det är ett hinder för spelaren        
    class obstacle {
        constructor(xpos, ypos){
            this.xpos = xpos;
            this.ypos = ypos;
        }

        draw(){
            //Else if för att få fienden att röra sig i riktning mot spelaren.
            if(this.xpos>player1.xpos){
                this.xpos += Math.random() * 20-15;   
            }
            else if(this.xpos<player1.xpos){
                this.xpos += Math.random() * 20-5;
            }
            if(this.ypos>player1.ypos){
                this.ypos += Math.random() *20-15;
            }
            else if(this.ypos<player1.ypos){
                this.ypos += Math.random() *20-5;

            }
            //Ett else if condition för att se till att fienden inte rör sig utanför canvas
            if(this.xpos>550){
                this.xpos =550;
            }
            else if(this.ypos<0){
                this.ypos = 0;
            }
            else if(this.xpos<0){
                this.xpos=0;
            }
            else if(this.ypos >350){
                this.ypos = 350;
            }
            this.width = 50;
            this.height = 50;
            //Här lägger jag in bilden som representerar fienden.
            this.ghost = document.getElementById("ghostImage");
            ctx.drawImage(this.ghost, this.xpos,this.ypos);

        }
    }
    //Skapa klass för körsbären i detta fall
    class food{
        constructor(xpos, ypos){
            this.xpos = xpos;
            this.ypos = ypos;
        }
        //Drawmetod för food
        draw(){
        this.width = 50;
        this.height = 50;
        //Här lägger jag in bilden som representerar målet
        this.cherry = document.getElementById("cherryImage");
        ctx.drawImage(this.cherry, this.xpos,this.ypos);
        }
    }
    //Update funktion för att köra runt spelet
    function update(){
            //Gör bara detta om spelarens status är alive
            if (player1.status == "alive"){
            //Här går det att använda clearRect om en vill ha vit bakgrund men jag ville ha blå 
            ctx.fillStyle = "#3366cc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //Rita upp spelar och körsbär
            player1.draw();
            cherry.draw();
            //Här använde jag en debug för att enklare kunna räkna ut kollitionshanteringen, se nedan    
            //console.log("player1 " + "X: " + player1.xpos + " Y: " + player1.ypos);
            
            //Skriv ut spelarens score
            ctx.fillStyle ="#33cc33";
            ctx.font = "20px Arial";
            ctx.fillText(player1.score,500,20);

            }
            //Kör detta om spelaren är dead
            else if (player1.status =="dead"){
                //Renska canvas
                ctx.fillStyle = "#3366cc";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //Ställ in fonts, storlek och skriv ut spelarens score och game over
                ctx.font = "60px Arial";
                ctx.strokeText("Game Over",200,150);
                ctx.strokeText("You scored " + player1.score, 150, 200);
            }
    }

    //Kollitionshantering
    function collition(){
        //Kolla om spelarens position nuddar fiendens position 
        if ((player1.xpos + player1.width) > osc.xpos &&
            player1.ypos > (osc.ypos - osc.height) &&
            player1.xpos < (osc.xpos + osc.width) &&
            player1.ypos < (osc.ypos + osc.width)
           ){
            //Ändra i så fall spelarens status till dead om spelaren nuddar fienden
            player1.status = "dead";
            }
        //Kolla om spelarens position nuddar körsbärets position
        if((player1.xpos + player1.width) > cherry.xpos &&
            player1.ypos > (cherry.ypos - cherry.height) &&
            player1.xpos < (cherry.xpos + cherry.width) &&
            player1.ypos < (cherry.ypos + cherry.width)
           ){
            //Lägg till 1 på spelarens score om spelaren nuddar körsbäret
            player1.score += 1;
            //Ändra körsbärets position till random inom canvas om spelaren nuddar körsbäret
            cherry.xpos = Math.random() * 550;
            cherry.ypos = Math.random() * 350;
            }
    }
    //Funktion för att rulla spelet
    function moveEnemy(){
    //Kör uppdateringsfunktionen
    update();
    //Rita ut fienden på nytt
    osc.draw();
    //Kolla om fienden och spelaren kolliderar
    collition();
    }

    //Initiera ett playerobjekt
    player1 = new player();
    //Initiera ett foodobjekt
    cherry = new food(300,300);
    //Initiera ett obstacleobjekt på n position långt från spelaren
    osc = new obstacle (550,350);
    //Lägg till en listener för att se om spelaren trycker på en knapp och kör då move funktionen som reder ut vilken knapp som tryckts ner och vart spelaren ska röra sig
    document.addEventListener("keydown", move)
    //Sätt ett intervall på moveEnemy här kan man ändra värdet för uppdateringshastigeten för att ändra svårighetsgraden
    setInterval(moveEnemy, 30)

})


  