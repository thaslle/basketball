import { shaderMaterial } from '@react-three/drei'
import { ReactThreeFiber } from '@react-three/fiber'
import * as THREE from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      stripesShaderMaterial: ReactThreeFiber.Node<
        typeof StripesShaderMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof StripesShaderMaterial
      >
    }
  }
}

const vertexShader = /*glsl*/ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`

const fragmentShader = /*glsl*/ `
  // Fragment Shader
  precision mediump float;

  varying vec2 vUv;

  uniform float lineWidth;
  uniform float spacing;
  uniform vec3 lineColor;
  uniform float lineOpacity;

  void main() {
    // First, I rotate my UVs to keep them always perfectly aligned 
    float angle = radians(45.0);
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedUv = vUv * rotation;
    
    // When I used the straightforward approach above, the edges of my mesh 
    // appeared misaligned, resulting in an odd effect
    //float diagonal = mod(vUv.x + vUv.y, spacing);

    float linePatternX = mod(rotatedUv.x, spacing);
    float linePatternY = mod(rotatedUv.y, spacing);

    // Use smoothstep with a narrow range for subtle anti-aliasing
    float lineX = smoothstep(lineWidth - 0.005, lineWidth + 0.003, linePatternX) *
                  (1.0 - smoothstep(spacing - lineWidth - 0.003, spacing - lineWidth + 0.003, linePatternX));
    float lineY = smoothstep(lineWidth - 0.003, lineWidth + 0.003, linePatternY) *
                  (1.0 - smoothstep(spacing - lineWidth - 0.003, spacing - lineWidth + 0.003, linePatternY));

    float line = max(lineX, lineY);

    vec3 color = mix(vec3(0.0), lineColor, line);
    float alpha = mix(0.0, lineOpacity, line);

    gl_FragColor = vec4(color, alpha);
  }
  `

export const StripesShaderMaterial = shaderMaterial(
  {
    lineWidth: 0.036,
    spacing: 0.09,
    lineColor: new THREE.Color(0xffffff),
    lineOpacity: 0.8,
  },
  vertexShader,
  fragmentShader,
)
