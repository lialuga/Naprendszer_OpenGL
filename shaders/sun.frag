#version 410 core
out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D texDiffuse;
uniform float time;

void main() {
    vec2 uv = TexCoord;
    // Animated wobble
    uv.x += sin(uv.y * 12.0 + time * 0.8) * 0.005;
    uv.y += cos(uv.x * 10.0 + time * 0.6) * 0.005;

    vec3 col = texture(texDiffuse, uv).rgb;
    // Boost brightness for emissive look
    col *= 1.3;
    col = clamp(col, 0.0, 1.0);
    FragColor = vec4(col, 1.0);
}
