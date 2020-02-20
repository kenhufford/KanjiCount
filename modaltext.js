class Modaltext {
    constructor(x, y, step) {
        this.x = x;
        this.y = y;
        this.step = step;
        this.text = {
            "0": ["Let's play Kirby Kount!","Language", "Difficulty", "Tutorial", "Music", "Math"],
            "1": ["Kirby is hungry and ready to order some sushi"],
            "2": ["Sushis will appear on the conveyor. Click to pick", "one up and click again to drop it."],
            "3": ["Orders will appear here.  Complete the order before" , "time runs out!  Click on the order to hear the word."],
            "4": ["Single character orders must be fed to Kirby! If you", "drop it near him he'll eat it."],
            "5": ["Multi-character orders must be plated. Holding a", "sushi near the plate will place it."],
            "6": ["If an order runs out of time or if you feed Kirby incorrectly,", "he will lose a heart. Fill up Kirby's health bar to win!"],
            "win": ["Great job! Kirby is pleased!", "Want to feed him again?"],
            "lose": ["Oh no! You've angered Kirby", "Want to try feeding him again?"],
            "lessonTutorial1": ["Welcome to Kirby Kount!", 
                                "Our goal is to teach you the Chinese/Japanese characters", 
                                "and counting systems using games and math!", 
                                "If you're already familiar with the characters and numbers", 
                                " or just want to try out the game, click Play Kirby Kount.", 
                                "Otherwise continue on to the Study Session section!"],
            "lessonTutorial2": ["Let's Study!", 
                                "Click on an answer and click again", 
                                "to drop it on the matching target", 
                                "Language", 
                                "Shuffle"]
        }
        this.location = { 
            "0": [[270, 50], [235, 135], [235, 235], [235, 335], [235, 435], [235, 535]],
            "1": [[225, 255]],
            "2": [[120, 340], [120, 370]],
            "3": [[200, 170], [200, 200]],
            "4": [[270, 240], [270, 270]],
            "5": [[225, 320], [225, 350]],
            "6": [[200, 275], [200, 305]],
            "win": [[250, 250], [250, 280]],
            "lose": [[250, 250], [250, 280]],
            "lessonTutorial1": [[285, 50], [150, 150], [150, 200], [150, 300], [150, 350], [150, 400], [150, 450]],
            "lessonTutorial2": [[390, 50], [290, 150], [290, 200], [460, 355], [460, 425]]
        }
    }

    render(ctx) {
        ctx.fillStyle = "#FFFFFF";
        this.text[this.step].forEach((string, i) => {
            if ((this.step === 0 || this.step === "lessonTutorial1" || this.step === "lessonTutorial2" ) && i === 0){ 
                ctx.font = "bolder 36px Dosis";
                ctx.fillStyle = "#ff90f6";
            } else {
                ctx.font = "bolder 28px Dosis";
                ctx.fillStyle = "#FFFFFF";
            }
            ctx.fillText(string, this.location[this.step][i][0], this.location[this.step][i][1]);
        })
    }
}