# Kirby Kount

![Image of Kirby](https://media.giphy.com/media/5ev3alRsskWA0/giphy.gif)

Welcome to Kirby Kount!  Kirby Kount is an educational app created to help anyone learn numbers and characters for numbers up to 10,000 in Mandarin, Cantonese and Japanese!  Kirby Kount current consists of two parts: Study Session and Kirby Kount.  If you want to learn the very basics of pronunciation and the characters, you should head on over to Study Session.

# A Quick Story

Kirby Kount was an app I had been wanting to make since I had first decided I should learn to program.  Before a trip to Japan, I was studying Japanese and having trouble learning the numbers and associated characters.  I knew that if I had a way to practically use and practice rather than strictly memorizing, the information would stick.  I couldn't find a fun game specifically for numbers so I thought it might be fun to learn Javascript and build it myself.  After about of month, I built the first version of this app and I was sold.  Programming was more challenging, rewarding and fun than anything I had done in my ten previous career years.  I knew that this was what I should be doing.

# Study Session Instructions

Study session should be pretty straight forward. When you enter Study Session, select a language and lesson type. While in session, click on a bubble and drag it toward the correct answer.  If you have sound on, you'll hear a pronunciation of the word when you get it right.  You can click the arrows on the left and right to move on or back to previous questions.

# Kirby Kount Instructions

![Image of Kirby](https://i.imgur.com/ikHP6Z8.png)

Once you're ready, head over to Kirby Kount.  The options screen lets you select different game modes which include different languages, higher values for numbers and math problems vs number identification.  I'd suggest turning on the tutorial and reading how to play there as it steps through the individual parts of the game.

Kirby is hungry.  He wants certain sushis that he will order by number.  You have a certain amount of time to feed Kirby the sushi associated with this number or he will be angry.  If Kirby is angry enough, you will face the wrath of Kirby. 

# Technology

Kirby Kount is build with Javascript, Canvas, CSS and HTML.  

# Cool Stuff

### Numbers to Characters and Speech

The math problems are randomly generated and then converted into characters and speech based on Japanese/Chinese number rules. Special thanks to Evans, Daphne and Rebecca for supplying the Mandarin, Cantonese and Japanese respectively!  Each language had some slightly different rules for special numbers.  Say 825 in Japanese.  It would breakdown to 8 (hachi) 100 (hyaku) 2 (ni) 10 (ju) 5 (go).  However, some numbers like 800 (happyaku instead of hachi hyaku), have exceptions that need to be accounted for.

```
let convertNumberToSoundArray = (num, language) => {
    let digits = Array.from(num.toString()).map(String);
    let results = [];
    let orderNumber;

    let order = {
        '5': '10000',
        '4': '1000',
        '3': '100',
        '2': '10',
    };

    if (language == 'japanese') {

        for (let i = 0; i < digits.length; i++) {
            orderNumber = digits.length - i;
            if (digits[i] == 0) {
                continue;
            } else if (orderNumber == 5 && digits[i] == 1) {
                results.push('10000a')
            } else if (orderNumber == 4 && digits[i] == 8) {
                results.push('8000')
            } else if (orderNumber == 4 && digits[i] == 3) {
                results.push('3000')
            } else if (orderNumber == 3 && digits[i] == 3) {
                results.push('300')
            } else if (orderNumber == 3 && digits[i] == 6) {
                results.push('600')
            } else if (orderNumber == 3 && digits[i] == 8) {
                results.push('800')
            } else if (digits[i] == 1 && orderNumber != 1) {
                results.push(order[orderNumber]);
            } else if (orderNumber == 1) {
                results.push(digits[i]);
            } else {
                results.push(digits[i]);
                results.push(order[orderNumber]);
            };
        }
  ```
### Fun with Sprites and Canvas

This app was easily the most fun thing I've ever built and a lot of that came from the rendering.  A lot of that fun, came due to the bugs and my early failures rendering sprites which in turn created hilarious results when rendered.  Rendering was done using sprites from Spriters Resource, a lot of GNU Image Manipulation Program work on said sprites and request animation frame. 

```
render(ctx) {
        let frame;
        if (this.speed > 0) {
            let max = this.frames.length;
            let idx = Math.floor(this._index);
            frame = this.frames[idx % max];

            if (this.once && idx >= max) {
                this.done = true;
                return this.done;
            }
        }
        else {
            frame = 0;
        }

        let x = this.pos[0];
        let y = this.pos[1];

        if (this.dir == 'vertical') {
            y += frame * this.size[1];
        }
        else {
            x += frame * this.size[0];
        }
        ctx.drawImage(resources.get(this.url),
            x, y,
            this.size[0], this.size[1],
            0, 0,
            this.size[0], this.size[1]);
    }
    ```
    
    ###
