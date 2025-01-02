import { useTexture } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'
import { useMemo } from 'react'

const BallMaterial = () => {
  const ballTexture = useTexture('/images/ball.png')

  const material = useMemo(() => {
    const ballMaterial = new MeshStandardMaterial({
      map: ballTexture, // Apply the texture to the material
      color: '#ff8429',
      transparent: true,
      fog: false,
      roughness: 0.5,
      metalness: 0.1,
    })

    ballMaterial.onBeforeCompile = (shader) => {
      // Inject custom varyings into the vertex shader
      shader.vertexShader = shader.vertexShader.replace(
        `#include <common>`,
        `
        #include <common>
        varying vec3 vPositionW;
        varying vec3 vNormalW;
        `,
      )

      // Calculate world position and normal in the vertex shader
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `
        #include <begin_vertex>
        vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        `,
      )

      // Inject custom varyings and Fresnel logic into the fragment shader
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `
        #include <common>
        varying vec3 vPositionW;
        varying vec3 vNormalW;
        `,
      )

      // Add Fresnel effect logic while preserving the original texture
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <dithering_fragment>`,
        `
        vec4 baseColor = gl_FragColor; // Existing material color
        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        viewDirectionW.y = viewDirectionW.y - 0.1;
        viewDirectionW.x = viewDirectionW.x - 0.1;

        vec3 rimColor = clamp(baseColor.rgb + vec3(0.8, 0.8, 0.0), 0.6, 1.0);
        float rimStrength = 2.0;
        float rimWidth = 0.5;

        float fresnelDotV = max(0.0, rimWidth - clamp(dot(viewDirectionW, vNormalW), 0.0, 1.0));
        vec3 fresnelTerm = fresnelDotV * rimColor * rimStrength;

        // Combine Fresnel effect with the base color
        vec3 fresnelColor = mix(baseColor.rgb, vec3(0.8), fresnelTerm);

        gl_FragColor = vec4(fresnelColor, baseColor.a);

        #include <dithering_fragment>
        `,
      )
    }

    return ballMaterial
  }, [ballTexture]) // Only re-run the material creation when the texture changes

  return material
}

export default BallMaterial
