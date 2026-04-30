#version 410 core
layout (location = 0) in vec3 aPos;

out vec3 TexCoords;

uniform mat4 projection;
uniform mat4 view;

void main() {
    TexCoords   = aPos;
    // Remove translation from view matrix so skybox stays around camera
    mat4 viewNoTranslation = mat4(mat3(view));
    vec4 pos    = projection * viewNoTranslation * vec4(aPos, 1.0);
    // Trick: set z = w so depth is always 1.0 (skybox behind everything)
    gl_Position = pos.xyww;
}
