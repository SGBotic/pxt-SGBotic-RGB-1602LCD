/**
 * microbit Makecode extensions for RGB 1602 Character LCD
 */


namespace sgbotic {
    let lcdAddr: number = 0x3E;
    let rgbAddr: number = 0x60;

    let RGB_REG_MODE1: number = 0x00;
    let RGB_REG_MODE2: number = 0x01;
    let REG_LEDOUT: number = 0x08;
    let REG_RED: number = 0x04;
    let REG_GREEN: number = 0x03;
    let REG_BLUE: number = 0x02;

    let LCD_2LINE: number = 28;
    let LCD_5x8DOTS: number = 0x20;

    let LCD_DISPLAYON: number = 0b00001100;

    let LCD_CURSORON: number = 0b00001010;
    let LCD_CURSOROFF: number = 0b00001000;

    let LCD_BLINKON: number = 0b00001001;
    let LCD_BLINKOFF: number = 0b00001000;
    let LCD_HOME: number = 0x02;

    let LCD_DISPLAYCONTROL: number = 0x08;
    let LCD_CLEARDISPLAY: number = 0x01;
    let LCD_CURSORINCREMENTON: number = 0b00000110;
    let LCD_CURSORSHIFTOFF: number = 0b00000100;

    let displaySetting: number = 0;

    export enum ClearEnum {
        //%block="row 0"
        block1 = 1,
        //%block="row 1"
        block2 = 2,
        //%block="all"
        block3 = 3
    }

    export enum ShowHideEnum {
        //%block="show"
        show = 1,
        //%block="hide"
        hide = 0
    }
    export enum CtrlStatEnum {
        //%block="on"
        on = 1,
        //%block="off"
        off = 0
    }

    /*
     * send command package
     */
    function lcdCmd(pData: number) {
        let buf: number[] = [0x80, pData];
        let sendBuf = pins.createBufferFromArray(buf);
        pins.i2cWriteBuffer(lcdAddr, sendBuf);
        basic.pause(1);
    }
    /*
    * send data package
    */
    function lcdData(pData: number) {
        let buf: number[] = [0x40, pData];
        let sendBuf = pins.createBufferFromArray(buf);
        pins.i2cWriteBuffer(lcdAddr, sendBuf);
        basic.pause(1);
    }

    /** 
    * send RGB package
    */
    function rgbWriteReg(d: number, n: number) {
        let buf: number[] = [d, n];
        let sendBuf = pins.createBufferFromArray(buf);
        pins.i2cWriteBuffer(rgbAddr, sendBuf);
        basic.pause(10);
    }

    /*
    * set RGB color
    */
    function rgb(r: number, g: number, b: number) {
        rgbWriteReg(REG_RED, r);
        rgbWriteReg(REG_GREEN, g);
        rgbWriteReg(REG_BLUE, b);
    }

    /*
    * write string
    */
    function String(s: string, x: number, y: number): void {
        cursorPos(x, y);
        for (let i = 0; i < s.length; i++) {
            lcdData(s.charCodeAt(i));
        }
    }

    /** 
    * Set cursor position
   */
    function cursorPos(row: number, col: number) {
        col = (row == 0 ? col | 0x80 : col | 0xc0);
        lcdCmd(col);
    }

    /**
     * Initialze LCD 
     */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="initLCD" block="Initialize LCD"
    //% weight=99 blockGap=20 color=#5DADE2
    export function initLCD() {
        basic.pause(50);

        // clear/ reset RGB registers
        rgbWriteReg(RGB_REG_MODE1, 0x0);
        rgbWriteReg(RGB_REG_MODE2, 0x0);

        lcdCmd(LCD_2LINE | LCD_5x8DOTS);      // set 4bit mode
        basic.pause(5);

        displaySetting = LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF;
        lcdCmd(displaySetting);
        basic.pause(5);

        lcdCmd(LCD_CLEARDISPLAY);
        basic.pause(10);
        lcdCmd(LCD_CURSORINCREMENTON | LCD_CURSORSHIFTOFF);
        basic.pause(5);
        cursorPos(0, 0);

        rgbWriteReg(RGB_REG_MODE1, 0x00);
        rgbWriteReg(REG_LEDOUT, 0xff);
        rgbWriteReg(RGB_REG_MODE2, 0x20);
    }

    /**
    * Print string from position defined by row and column.
    */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="writeString" block="write string %s| Row %row|Column %col"
    //% weight=98 blockGap=20 color=#5DADE2
    //% col.min=0 col.max=15
    //% row.min=0 row.max=1
    export function writeString(s: string, row: number, col: number): void {
        cursorPos(row, col);
        for (let i = 0; i < s.length; i++) {
            lcdData(s.charCodeAt(i));
        }
    }

    /**
    * Print number from position defined by row and column.
    */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="writeNumber" block="write number %n| Row %row|Column %col"
    //% weight=96 blockGap=20 color=#5DADE2
    //% col.min=0 col.max=15
    //% row.min=0 row.max=1
    export function writeNumber(n: number, row: number, col: number): void {
        let s = n.toString()
        writeString(s.slice(0, 9), row, col);
    }

    /**
     * Clear display. Select row or clear all
     */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="clear" block="clear |%clr"
    //% weight=94 blockGap=20 color=#5DADE2
    export function clearScreen(clr: ClearEnum): void {
        let i: number = 0;

        if (clr == 1) {
            for (i = 0; i <= 15; i++)
                String(" ", i, 0);
        }
        if (clr == 2) {
            for (i = 0; i <= 15; i++)
                String(" ", i, 1);
        }
        if (clr == 3) {
            lcdCmd(0x01);
        }
    }

    /**
     * Set color
     */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="colourPicker" block="colour |%rgbVal"
    //% rgbVal.shadow="colorNumberPicker"
    //% weight=92 blockGap=20 color=#5DADE2
    export function colourPicker(rgbVal: number): void {
        let r = (rgbVal >> 16)
        let g = ((rgbVal >> 8) & 0xFF)
        let b = ((rgbVal) & 0xFF)
        rgb(r, g, b);
    }

    /**
    * Set backlight color in RGB
    */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="colourRGB" block="colour r|%r g|%g b|%b"
    //% weight=90 blockGap=20 color=#5DADE2
    export function colourRGB(r: number, g: number, b: number): void {
        rgb(r, g, b);
    }

    /**
     * Set display on/off
     */
    //% subcategory=RGB-1602LCD
    //% group="core"
    //% blockId="display" block="display |%displayStat"
    //% weight=88 blockGap=20 color=#5DADE2
    export function display(displayStat: ShowHideEnum): void {
        if (displayStat == 0) { //display off
            displaySetting |= LCD_DISPLAYON;
            lcdCmd(LCD_DISPLAYCONTROL | displaySetting);
        } else {  //display on
            displaySetting &= ~LCD_DISPLAYON;
            lcdCmd(LCD_DISPLAYCONTROL | displaySetting);
        }
    }

    /**
    * blink backlight
    */
    //% subcategory=RGB-1602LCD
    //% group="advance"
    //% blockId="blinkBacklight" block="blink backlight |%displayStat"
    //% weight=76 blockGap=20 color=#7FB3D5
    export function blinkBacklight(displayStat: CtrlStatEnum): void {
        if (displayStat == 0) { //blink backlight off
            rgbWriteReg(0x07, 0x00); // GRPFREQ
            rgbWriteReg(0x06, 0xFF); // GRPPWM
        } else {  //blink backlight on
            rgbWriteReg(0x07, 0x17); // blink every second
            rgbWriteReg(0x06, 0x7F); // half on, half off
        }
    }

    /**
    * Enable/disable LCD backlight
    */
    //% subcategory=RGB-1602LCD
    //% group="advance"
    //% blockId="backlight" block="backlight |%displayStat"
    //% weight=74 blockGap=20 color=#7FB3D5
    export function backlight(displayStat: CtrlStatEnum): void {
        if (displayStat == 0) { // backlight off
            rgbWriteReg(REG_LEDOUT, 0x00);
        } else {  // backlight on
            rgbWriteReg(REG_LEDOUT, 0xFF);
        }
    }

    /**
     * Enable/disable LCD cursor
     */
    //% subcategory=RGB-1602LCD
    //% group="advance"
    //% blockId="cursor" block="cursor %pcursor"
    //% weight=72 blockGap=20 color=#7FB3D5
    export function cursor(pcursor: ShowHideEnum) {
        if (pcursor == 0) {//off
            displaySetting &= ~LCD_CURSORON;
            lcdCmd(LCD_DISPLAYCONTROL | displaySetting);
        } else { //on
            displaySetting |= LCD_CURSORON;
            lcdCmd(LCD_DISPLAYCONTROL | displaySetting);
        }
    }

    /**
     * blink cursor
     */
    //% subcategory=RGB-1602LCD
    //% group="advance"
    //% blockId="blinkCursor" block="blink cursor %bcursor"
    //% weight=68 blockGap=20 color=#7FB3D5
    export function blinkCursor(bcursor: CtrlStatEnum) {
        if (bcursor == 0) {//off
            displaySetting &= ~LCD_BLINKON;
            lcdCmd(LCD_DISPLAYCONTROL | displaySetting);
        } else { //on
            displaySetting |= LCD_BLINKON;
            lcdCmd(LCD_DISPLAYCONTROL | displaySetting);
        }
    }

    /**
     * Move cursor to row 0 and column 0
     */
    //% subcategory=RGB-1602LCD
    //% group="advance"
    //% blockId="cursorHome" block="cursor home"
    //% weight=66 blockGap=20 color=#7FB3D5
    export function cursorHome(): void {
        lcdCmd(LCD_HOME);
    }
}
