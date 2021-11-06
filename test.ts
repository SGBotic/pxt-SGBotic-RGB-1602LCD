// Test file for SGBotic RGB 1602 LCD
// example code initialize the LCD, change the backlight color to red 
// print string and number to LCD

sgbotic.initLCD()
sgbotic.backlightColor(0xff0000)
sgbotic.writeString("hello world!", 0, 0)
sgbotic.writeNumber(2021, 1, 0)