export function vec2(x, y) {
    const v = new Float32Array(2);
    v[0] = x;
    v[1] = y;
    return v;
}
export function vec3(x, y, z) {
    const v = new Float32Array(3);
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return v;
}
export function vec4(x, y, z, w) {
    const v = new Float32Array(4);
    v[0] = x;
    v[1] = y;
    v[2] = z;
    v[3] = w;
    return v;
}
export class vec2i {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
