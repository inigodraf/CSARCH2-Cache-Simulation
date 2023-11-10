// 4-way BSA + FIFO

const cache_blocks = 16
const cache_line = 32
const sets = []
const test_a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const test_b = [3, 7, 11, 2, 15, 6, 0, 1, 8, 4, 13, 9, 5, 10, 14, 12, 19, 24, 22, 17, 20, 31, 29, 26, 18, 25, 21, 30, 28, 16, 23, 27, 35, 38, 34, 37, 32, 39, 33, 36, 40, 41, 45, 48, 44, 47, 42, 49, 43, 46, 51, 54, 50, 55, 59, 52, 57, 53, 58, 60, 56, 63, 61, 62]
const test_c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

document.addEventListener('DOMContentLoaded', e => {

    for (let i = 0; i < 4; i++) {
        sets[i] = new Set(i)
    }
    let temp = 0x123123

    test_b.forEach(address => {
        sets[address % n_sets].map(address)
    })
})

class Set {

    constructor(set_no) {
        this.size = 4
        this.blocks = []
        this.next_dequeue = 0
        this.outputs = []
        for (let i = 0; i < 4; i++) {
            this.outputs[i] = document.getElementById(`${set_no}-${i}`)
        }
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
            } else {
                this.blocks[this.next_dequeue] = address
                this.outputs[this.next_dequeue].innerHTML = address
                this.next_dequeue = (this.next_dequeue + 1) % this.size
            }
        }
    }
}