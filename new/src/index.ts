import { writeFile, readFile, readdir, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { parse } from '@tracespace/parser'
import { render } from '@tracespace/renderer'
import { plot } from '@tracespace/plotter'
import { toHtml } from 'hast-util-to-html'

const GERBER_DIR = '../boards/ESP32-DevKitC-V4_20171206A'

await rm('output', { recursive: true, force: true })
await mkdir('output')

const filenames = (await readdir(GERBER_DIR))
    .filter(filename => filename.endsWith('.pho'))
filenames.forEach(async filename => {
    console.log(`Gerber filename: ${filename}`)
    const gerberContents = await readFile(join(GERBER_DIR, filename), 'utf-8')
    const syntaxTree = parse(gerberContents)
    const imageTree = plot(syntaxTree)
    const image = render(imageTree)

    await writeFile(join('output', filename + '-syntax-tree.json'), JSON.stringify(syntaxTree, null, 2), 'utf-8')
    await writeFile(join('output', filename + '-image-tree.json'), JSON.stringify(imageTree, null, 2), 'utf-8')
    await writeFile(join('output', filename + '-image.json'), JSON.stringify(image, null, 2), 'utf-8')
    await writeFile(join('output', filename + '-image.svg'), toHtml(image), 'utf-8')
})
