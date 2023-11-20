// 4-way BSA + FIFO

let cache = null
let isInitialized = false

let mem_seq = null
let step_ctr = 0

const test_a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const test_b = [3, 7, 11, 2, 15, 6, 0, 1, 8, 4, 13, 9, 5, 10, 14, 12, 19, 24, 22, 17, 20, 31, 29, 26, 18, 25, 21, 30, 28, 16, 23, 27, 35, 38, 34, 37, 32, 39, 33, 36, 40, 41, 45, 48, 44, 47, 42, 49, 43, 46, 51, 54, 50, 55, 59, 52, 57, 53, 58, 60, 56, 63, 61, 62]
const test_c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

document.addEventListener('DOMContentLoaded', e => {

    const runBtn = document.getElementById('full-run')
    runBtn.addEventListener('click', e => {
        initialize()
        step()
        step_ctr = 0
        cache = null
        isInitialized = false
    })

    const stepBtn = document.getElementById('step')
    stepBtn.addEventListener('click', e => {
        if (!isInitialized)
            initialize()
        step(false)
    })

    const resetBtn = document.getElementById('reset')
    resetBtn.addEventListener('click', e => {
        isInitialized = false
        document.getElementById('snapshot').innerHTML = ''
        cache = null
        step_ctr = 0
    })
})

function step(skip = true) {
    if (!skip) {
        cache.find(mem_seq[step_ctr])
        step_ctr++
    } else {
        mem_seq.forEach(addr => cache.find(addr))
    }
}

function initialize() {
    const block_size = parseInt(document.getElementById('block-size').value)
    const set_size = parseInt(document.getElementById('set-size').value)
    let mm_size = parseInt(document.getElementById('mm-size').value)
    let cm_size = parseInt(document.getElementById('cm-size').value)
    const mm_size_type = parseInt(document.getElementById('mm-size-type').value)
    const cm_size_type = parseInt(document.getElementById('cm-size-type').value)
    mem_seq = parseCSV(document.getElementById('mem-seq').value)

    if (mm_size_type)
        mm_size = mm_size / block_size

    if (cm_size_type)
        cm_size = cm_size / block_size

    const snapshot = document.getElementById('snapshot')
    snapshot.innerHTML = ''

    cache = new Cache(cm_size, set_size)

    isInitialized = true
}

function parseCSV(csv) {
    return csv.split(',')
            .map(value => parseInt(value.trim(), 10))
            .filter(value => !isNaN(value))
}

class Cache {
    constructor(size, set_size) {
        this.size = size
        this.sets = []
        for (let i = 0; i < size / set_size; i++) {
            this.sets[i] = new Set(i, set_size)
            this.sets[i].createElements()
        }

        for (let i = 0; i < this.sets.length; i++)
            this.sets[i].assignElements()
    }

    find(addr) {
        this.sets[addr % this.sets.length].map(addr)
    }
}

class Set {

    constructor(set_no, size) {
        this.set_no = set_no
        this.size = size
        this.blocks = []
        this.next_dequeue = 0
        this.outputs = []
        this.t = []
    }

    map(address) {
        let are_you_there = false
        this.blocks.forEach(block => {
            if (block == address) {
                are_you_there = true
                return
            }
        })
        if (!are_you_there) {
            if (this.blocks.length < this.size) {
                this.blocks.push(address)
                this.outputs[this.blocks.length - 1].innerHTML = address
                this.t[this.blocks.length - 1].innerHTML = `(${this.blocks.length})`
            } else {
                this.blocks[this.next_dequeue % 4] = address
                this.outputs[this.next_dequeue % 4].innerHTML = address
                this.t[this.next_dequeue % 4].innerHTML = `(${this.next_dequeue + 1})`
            }
            this.next_dequeue++
        }
    }

    createElements() {
        const snapshot = document.getElementById('snapshot')
        let html = ''
        for (let i = 0; i < this.size; i++) {
            html += '<tr>\n'
            if (i == 0) {
                html += `<td class="border-black border px-2" rowspan="${this.size}">Set ${this.set_no}</td>\n`
            }
            html += `<td class="border-black border px-2">Block ${i}:&nbsp;</td>\n`
            html += `<td class="border-black border px-2" id="${this.set_no}-${i}">Empty</td>\n`
            html += `<td class="border-black border px-2" id="t${this.set_no}-${i}">N/A</td>\n`
            html += '</tr>\n'
        }
        snapshot.innerHTML += html
    }

    assignElements() {
        for (let i = 0; i < this.size; i++) {
            this.outputs[i] = document.getElementById(`${this.set_no}-${i}`)
            this.t[i] = document.getElementById(`t${this.set_no}-${i}`)
        }
    }
}