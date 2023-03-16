'use strict'

const path = require('path')
const fs = require('fs')
const pcb = require('pcb-stackup')

const GERBER_DIRECTORY = path.join(__dirname, '../boards/arduino-uno')
// const GERBER_DIRECTORY = path.join(__dirname, '../boards/ESP32-DevKitC-V4_20171206A')

const TOP_SVG = path.join(__dirname, 'top.svg')
const BOTTOM_SVG = path.join(__dirname, 'bottom.svg')

console.log(`Read files from director: ${GERBER_DIRECTORY}`)

const filenames = fs.readdirSync(GERBER_DIRECTORY)
console.log(`List of filenames: ${filenames}`)

const files = filenames.map(filename => ({
    filename: filename,
    gerber: fs.createReadStream(path.join(GERBER_DIRECTORY, filename))
}))

pcb(files)
    .then(stackup => {
        fs.writeFile(TOP_SVG, stackup.top.svg, () => {
            console.log(`Wrote ${TOP_SVG}`)
            fs.writeFile(BOTTOM_SVG, stackup.bottom.svg, () => {
                console.log(`Wrote ${BOTTOM_SVG}`)
            })
        })
    })