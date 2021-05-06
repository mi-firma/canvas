export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translate(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}
