#version 410 core
out vec4 FragColor;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoord;

uniform sampler2D texDiffuse;

// Sun (point light)
uniform vec3  sunPos;
uniform vec3  sunColor;
uniform float sunConstant;
uniform float sunLinear;
uniform float sunQuadratic;

// Spotlight (camera flashlight)
uniform bool  spotlightOn;
uniform vec3  spotlightPos;
uniform vec3  spotlightDir;
uniform vec3  spotlightColor;
uniform float spotlightCutoff;
uniform float spotlightOuterCutoff;
uniform float spotlightConstant;
uniform float spotlightLinear;
uniform float spotlightQuadratic;

// Ambient
uniform float ambientStrength;

void main() {
    vec3 texColor = texture(texDiffuse, TexCoord).rgb;
    vec3 norm     = normalize(Normal);

    // --- Ambient ---
    vec3 ambient = ambientStrength * texColor;

    // --- Sun diffuse (point light with attenuation) ---
    vec3 lightDir   = normalize(sunPos - FragPos);
    float diff      = max(dot(norm, lightDir), 0.0);
    float dist      = length(sunPos - FragPos);
    float atten     = 1.0 / (sunConstant + sunLinear * dist + sunQuadratic * dist * dist);
    vec3 diffuse    = diff * sunColor * texColor * atten;

    vec3 result = ambient + diffuse;

    // --- Spotlight ---
    if (spotlightOn) {
        vec3 sDir      = normalize(spotlightPos - FragPos);
        float theta    = dot(sDir, normalize(-spotlightDir));
        float epsilon  = spotlightCutoff - spotlightOuterCutoff;
        float intensity= clamp((theta - spotlightOuterCutoff) / epsilon, 0.0, 1.0);

        float sDist    = length(spotlightPos - FragPos);
        float sAtten   = 1.0 / (spotlightConstant + spotlightLinear * sDist + spotlightQuadratic * sDist * sDist);

        float sDiff    = max(dot(norm, sDir), 0.0);
        vec3 sDiffuse  = sDiff * spotlightColor * texColor * sAtten * intensity;
        result += sDiffuse;
    }

    FragColor = vec4(result, 1.0);
}
