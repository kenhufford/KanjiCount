class Modaltext {
    constructor(x, y, step) {
        this.x = x;
        this.y = y;
        this.step = step;
        this.text = {
            "0": ["Welcome to Kirby Kount!","Language", "Difficulty", "Tutorial", "Music", "Math"],
            "1": ["Kirby is hungry and ready to order some sushi"],
            "2": ["Sushis will appear on the conveyor. Click to pick", "one up and click again to drop it."],
            "3": ["Orders will appear here.  Complete the order before" , "time runs out!  Click on the order to hear the word."],
            "4": ["Single character orders must be fed to Kirby! If you", "drop it near him he'll eat it."],
            "5": ["Multi-character orders must be plated. Holding a", "sushi near the plate will place it."],
            "6": ["If an order runs out of time or if you feed Kirby incorrectly,", "he will lose a heart. Fill up Kirby's health bar to win!"],
            "win": ["Great job! Kirby is pleased!", "Want to feed him again?"],
            "lose": ["Oh no! You've angered Kirby", "Want to try feeding him again?"],
            "lesson1": ["Welcome to Kirby Count!", "Our goal is to teach you the Chinese/Japanese characters", "and counting systems through games and math!", "Click to Continue"],
            "lesson2": ["If you're already familiar with the characters", " or just want to try out the game. Click Play", "Otherwise continue on to the study session ", "section!"],
            "lesson3": ["Let's Study!", "Click on an answer and click again", "to drop it on the matching target", "Language", "Shuffle"]
        }
        this.location = {
            "0": [[270, 50], [235, 135], [235, 235], [235, 335], [235, 435], [235, 535]],
            "1": [[225, 255]],
            "2": [[120, 340], [120, 370]],
            "3": [[200, 170], [200, 200]],
            "4": [[270, 240], [270, 270]],
            "5": [[225, 300], [225, 330]],
            "6": [[255, 275], [255, 305]],
            "win": [[250, 250], [250, 280]],
            "lose": [[250, 250], [250, 280]],
            "lesson1": [[300, 50], [150, 150], [150, 200], [340, 500]],
            "lesson2": [[200, 150], [200, 200], [200, 250], [200, 300]],
            "lesson3": [[390, 50], [290, 150], [290, 200], [460, 355], [460, 425]]
        }
    }

    render(ctx) {
        ctx.fillStyle = "#FFFFFF";
        this.text[this.step].forEach((string, i) => {
            if (this.step === 0 && i === 0){ 
                ctx.font = "bolder 36px Dosis"
            } else {
                ctx.font = "bolder 28px Dosis";
            }
            ctx.fillText(string, this.location[this.step][i][0], this.location[this.step][i][1]);
        })
    }
}