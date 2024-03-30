class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.parent = null;
    this.children = [];
  }

  setVisited() {
    this.visited = true;
  }

  setParent(node) {
    this.parent = node;
  }

  addChild(node) {
    this.children.push(node);
  }
}

class Board {
  constructor(size = 8) {
    if (size < 8 || size % 8 > 0) throw Error('Board size error');
    this.size = size;
    this.board = this.setBoard();
  }

  setBoard() {
    // Represents chess board as a graph with adjacency lists
    const board = [];

    for (let x = 0; x < this.size; x++) {
      board[x] = [];
      for (let y = 0; y < this.size; y++) {
        // Get possible moves for each square
        board[x][y] = this.getPossibleMoves(x, y);
      }
    }

    return board;
  }

  getPossibleMoves(x, y) {
    // Creates a node with possible moves as children
    const node = new Node(x, y);
    const knightMoves = [
      [2, -1],
      [2, 1],
      [1, -2],
      [1, 2],
      [-1, -2],
      [-1, 2],
      [-2, -1],
      [-2, 1],
    ];

    knightMoves.forEach((move) => {
      const moveX = x + move[0];
      const moveY = y + move[1];

      if (moveX >= 0 && moveX < this.size && moveY >= 0 && moveY < this.size) {
        // Add possible move as a child
        const child = new Node(moveX, moveY);
        node.addChild(child);
      }
    });

    return node;
  }

  knightMoves(start, end) {
    // Create a queue for BFS
    const [startX, startY] = start;
    const [endX, endY] = end;

    if (startX < 0 || startY < 0 || startX >= this.size || startY >= this.size)
      throw Error('Source coordinates out of range');
    if (endX < 0 || endY < 0 || endX >= this.size || endY >= this.size)
      throw Error('Destination coordinates out of range');

    const queue = [];

    // Mark the current node as visited and enqueue it
    const startNode = this.board[startX][startY];
    startNode.setVisited();
    queue.push(startNode);

    // Iterate over the queue
    while (queue.length !== 0) {
      let currentNode = queue.shift();

      if (currentNode.x === endX && currentNode.y === endY) {
        // currentNode is the goal => get shortest path from destination to source
        const path = [];
        path.push([currentNode.x, currentNode.y]);

        let pathDistance = 0;
        while (currentNode.x !== startX || currentNode.y !== startY) {
          // Backtracking from the destination node up to the starting node
          currentNode = currentNode.parent;
          path.unshift([currentNode.x, currentNode.y]);
          pathDistance += 1;
        }

        return { path, pathDistance };
      }

      // Get all adjacent vertices of the dequeued vertex currentNode
      // If an adjacent has not been visited, then mark it visited and enqueue it
      currentNode.children.forEach((child) => {
        child = this.board[child.x][child.y];
        if (!child.visited) {
          child.setVisited();
          child.setParent(currentNode);
          queue.push(child);
        }
      });
    }
  }
}

const board = new Board();
const { path, pathDistance } = board.knightMoves([3, 3], [4, 3]);

console.log(`You made it in ${pathDistance} moves! Here's your path:`);
path.forEach((square) => console.log(`[${square.join(',')}]`));
