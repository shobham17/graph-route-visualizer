type HeapNode = {
  node: number
  distance: number
}

class MinHeap {

  heap: HeapNode[]

  constructor() {

    this.heap = []
  }

  getParentIndex(index: number) {

    return Math.floor(
      (index - 1) / 2
    )
  }

  getLeftChildIndex(
    index: number
  ) {

    return index * 2 + 1
  }

  getRightChildIndex(
    index: number
  ) {

    return index * 2 + 2
  }

  swap(i: number, j: number) {

    ;[
      this.heap[i],
      this.heap[j],
    ] = [
      this.heap[j],
      this.heap[i],
    ]
  }

  insert(node: HeapNode) {

    this.heap.push(node)

    this.heapifyUp()
  }

  heapifyUp() {

    let index =
      this.heap.length - 1

    while (
      index > 0
    ) {

      const parentIndex =
        this.getParentIndex(index)

      if (
        this.heap[parentIndex]
          .distance <=
        this.heap[index]
          .distance
      ) {
        break
      }

      this.swap(
        parentIndex,
        index
      )

      index = parentIndex
    }
  }

  extractMin():
    | HeapNode
    | null {

    if (
      this.heap.length === 0
    ) {
      return null
    }

    if (
      this.heap.length === 1
    ) {
      return this.heap.pop()!
    }

    const min =
      this.heap[0]

    this.heap[0] =
      this.heap.pop()!

    this.heapifyDown()

    return min
  }

  heapifyDown() {

    let index = 0

    while (true) {

      let smallest = index

      const left =
        this.getLeftChildIndex(
          index
        )

      const right =
        this.getRightChildIndex(
          index
        )

      if (
        left <
          this.heap.length &&
        this.heap[left]
          .distance <
          this.heap[smallest]
            .distance
      ) {

        smallest = left
      }

      if (
        right <
          this.heap.length &&
        this.heap[right]
          .distance <
          this.heap[smallest]
            .distance
      ) {

        smallest = right
      }

      if (
        smallest === index
      ) {
        break
      }

      this.swap(
        index,
        smallest
      )

      index = smallest
    }
  }

  isEmpty() {

    return (
      this.heap.length === 0
    )
  }
}

export default MinHeap