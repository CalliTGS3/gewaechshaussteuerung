input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    basic.showNumber(Bodenfeuchte)
    basic.pause(1000)
    basic.clearScreen()
})
function Pumpe_aus () {
    Pumpenstatus = 0
    pins.analogWritePin(AnalogPin.P2, Pumpenstatus)
}
function Pumpe_an () {
    Pumpenstatus = 1023
    pins.analogWritePin(AnalogPin.P2, Pumpenstatus)
    Sekunden_seit_gießen = 0
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    Sekunden_seit_gießen = WartezeitNachGiessenInSekunden
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showNumber(Sekunden_seit_gießen)
    basic.pause(1000)
    basic.clearScreen()
})
function SchliesseDach () {
    basic.setLedColor(0xffff00)
    pins.servoWritePin(AnalogPin.C4, 75)
    basic.pause(500)
    basic.setLedColor(0xffff00)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 60)
    basic.pause(500)
    basic.setLedColor(0xffff00)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 45)
    basic.pause(500)
    basic.setLedColor(0xffff00)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 30)
    basic.pause(500)
    basic.setLedColor(0xffff00)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 15)
    basic.pause(500)
    basic.setLedColor(0xffff00)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 0)
    DachGeschlossen = true
}
function messe_Bodenfeuchte () {
    pins.digitalWritePin(DigitalPin.P0, 1)
    Bodenfeuchte = pins.analogReadPin(AnalogPin.P1)
    pins.digitalWritePin(DigitalPin.P0, 0)
}
function OeffneDach () {
    pins.servoWritePin(AnalogPin.C4, 15)
    basic.pause(500)
    basic.setLedColor(0xff0000)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 30)
    basic.pause(500)
    basic.setLedColor(0xff0000)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 45)
    basic.pause(500)
    basic.setLedColor(0xff0000)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 60)
    basic.pause(500)
    basic.setLedColor(0xff0000)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 75)
    basic.pause(500)
    basic.setLedColor(0xff0000)
    basic.pause(500)
    basic.turnRgbLedOff()
    pins.servoWritePin(AnalogPin.C4, 90)
    DachGeschlossen = false
}
let Temperatur = 0
let Pumpsekunden = 0
let Pumpenstatus = 0
let Bodenfeuchte = 0
let Sekunden_seit_gießen = 0
let WartezeitNachGiessenInSekunden = 0
let DachGeschlossen = false
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
BME280.PowerOn()
serial.redirectToUSB()
DachGeschlossen = true
WartezeitNachGiessenInSekunden = 1 * 60
let GrenzwertBodenfeuchte = 500
let DauerPumpenInSekunden = 10
Sekunden_seit_gießen = 0
loops.everyInterval(1000, function () {
    if (Pumpsekunden == 0) {
        Pumpe_aus()
    } else {
        Pumpe_an()
        Pumpsekunden += -1
    }
    if (Sekunden_seit_gießen >= WartezeitNachGiessenInSekunden) {
        messe_Bodenfeuchte()
        if (Bodenfeuchte < GrenzwertBodenfeuchte) {
            Pumpsekunden = DauerPumpenInSekunden
        }
    }
    Sekunden_seit_gießen += 1
})
basic.forever(function () {
    Temperatur = BME280.temperature(BME280_T.T_C)
    serial.writeValue("x", Temperatur)
    if (Temperatur < 25 && !(DachGeschlossen)) {
        SchliesseDach()
    }
    if (Temperatur > 30 && DachGeschlossen) {
        OeffneDach()
    }
    basic.pause(5000)
})
