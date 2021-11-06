# Makecode extensions for RGB 1602 character LCD

Makecode extensions for [RGB 1602 character LCD](https://www.sgbotic.com/index.php?dispatch=products.view&product_id=3254), an I2C character LCD with RGB backlight.

## Core

* Initialize LCD
```blocks
sgbotic.initLCD()
```

* Write string to specific location
```blocks
sgbotic.writeString("hello world!", 0, 0)
```

* Write number to specific location
```blocks
sgbotic.writeNumber(2021, 1, 0)
```

* Clear screen - either individual row or all rows
```blocks
sgbotic.clearScreen(sgbotic.ClearEnum.block1)
```

* Set backlight color using 24-bit format
```blocks
sgbotic.backlightColor(0xff0000)
```

* Set backlight color using RGB value
```blocks
sgbotic.backlightColorRGB(0, 0, 0)
```

* Enable / disable display
```blocks
sgbotic.display(sgbotic.ShowHideEnum.show)
```
## Advanced
* Blink blacklight
```blocks
sgbotic.blinkBacklight(sgbotic.CtrlStatEnum.on)
```

* Enable / disable backlight
```blocks
sgbotic.backlight(sgbotic.CtrlStatEnum.on)
```

* Show / hide cursor
```blocks
sgbotic.cursor(sgbotic.ShowHideEnum.show)
```

* Blink cursor
```blocks
sgbotic.blinkCursor(sgbotic.CtrlStatEnum.on)
```

* Move cursor to row 0 column 0
```blocks
sgbotic.cursorHome()
```


## License

MIT

## Supported targets

* for PXT/microbit

