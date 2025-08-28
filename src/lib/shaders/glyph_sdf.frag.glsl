precision highp float;

uniform float uHovered;

float sd_circle(vec2 uv, float r) {
    return length(uv) - r;
}

float sd_star(vec2 p, float r, int n, float m) {
    float an = 3.141592653 / float(n);
    float en = 3.141592653 / m;
    float r_ = length(p);
    float a = atan(p.y, p.x);
    a = mod(a, 2.0 * an) - an;
    return r_ * cos(a) - r * cos(en) / cos(an - en);
}

void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);

    float c = sd_circle(uv, 0.4);
    float c2 = sd_circle(uv + vec2(0.2, 0.0), 0.3);
    float crescent = max(c, -c2);

    float s = sd_star(uv - vec2(0.1, 0.0), 0.15, 5, 2.5);

    float shape = min(crescent, s);

    float alpha = 1.0 - smoothstep(0.0, 0.02, shape);

    if (alpha < 0.1) discard;

    vec3 color = vec3(1.0);
    // This is not working as expected, gl_PointCoord is not available here to get the index.
    // I will implement this in a different way in the component.
    // if (gl_PrimitiveID == int(uHovered)) {
    //   color = vec3(0.8, 0.8, 0.2);
    // }

    gl_FragColor = vec4(color, alpha);
}
