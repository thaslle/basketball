/* eslint-disable react/no-unknown-property */
import React, { useRef, createRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { RigidBody, useRopeJoint } from '@react-three/rapier';
import { shaderMaterial, Sphere } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { SETTINGS } from '../config/config';

// Helper to generate positions for each joint
const generateNet = (heightSegments, radialSegments, baseRadius) => {
  const positions = [];
  for (let h = 0; h < heightSegments; h++) {
    const radius = baseRadius * Math.pow(0.95, h);
    for (let r = 0; r < radialSegments; r++) {
      const angle = (r / radialSegments) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = h * -0.25; // Vertical spacing
      positions.push(new Vector3(x, y, z));
    }
  }
  return positions;
};

// Hook to create joints between two points
const NetJoint = ({ a, b, maxDistance }) => {
  useRopeJoint(a, b, [
    [0, 0, 0], // Local anchor for joint A
    [0, 0, 0], // Local anchor for joint B
    maxDistance, // Max distance between points (rope length)
  ]);
  return null;
};

const NetMesh = ({ vertices, indices, uvs }) => {
  const geometryRef = useRef(new THREE.BufferGeometry());
  const meshShaderRef = useRef();

  const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

  const fragmentShader = `
  // Fragment Shader
  precision mediump float;

  varying vec2 vUv;

  uniform float lineWidth;
  uniform float spacing;
  uniform vec3 lineColor;
  uniform float lineOpacity;

  void main() {
    float angle = radians(45.0);
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedUv = vUv * rotation;

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
  `;

  const StripesShaderMaterial = shaderMaterial(
    {
      lineWidth: 0.036,
      spacing: 0.09,
      lineColor: new THREE.Color(0xffffff),
      lineOpacity: 0.8,
    },
    vertexShader,
    fragmentShader,
  );

  extend({ StripesShaderMaterial });

  useEffect(() => {
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometryRef.current.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); // Apply UVs
    geometryRef.current.setIndex(indices);
    geometryRef.current.computeVertexNormals(); // Ensure normals for lighting
  }, [vertices, indices, uvs]);

  return (
    <mesh position={[0, -2.92, 2.4]} renderOrder={1} frustumCulled={false}>
      <bufferGeometry ref={geometryRef} />
      <stripesShaderMaterial
        ref={meshShaderRef}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        depthTest={true}
        alphaTest={0.5}
      />
    </mesh>
  );
};

// Main Net component that generates vertices, indices, and UVs
export const Net = ({ heightSegments = 3, radialSegments = 6, baseRadius = 0.5 }) => {
  const [netPoints, setNetPoints] = useState({});
  const refs = useRef(Array.from({ length: heightSegments * radialSegments }).map(() => createRef()));

  // Generate positions for each joint
  const positions = generateNet(heightSegments, radialSegments, baseRadius);

  useFrame(() => {
    const vertices = [];
    const indices = [];
    const uvs = [];
    const uniqueVertices = new Map();

    const addVertex = (point, uv) => {
      const key = `${point[0]}_${point[1]}_${point[2]}`;
      if (!uniqueVertices.has(key)) {
        uniqueVertices.set(key, vertices.length / 3);
        vertices.push(...point);
        uvs.push(...uv); // Store UV coordinates
      }
      return uniqueVertices.get(key);
    };

    refs.current.forEach((ref, i) => {
      if (ref.current) {
        const row = Math.floor(i / radialSegments);
        const v = row / (refs.current.length / radialSegments - 1);
        const u = (i % radialSegments) / (radialSegments - 1);

        const topLeftIndex = i;
        const topRightIndex = (i + 1) % radialSegments === 0 ? i - radialSegments + 1 : i + 1;
        const bottomLeftIndex = topLeftIndex + radialSegments;
        const bottomRightIndex = topRightIndex + radialSegments;

        if (bottomLeftIndex < refs.current.length && bottomRightIndex < refs.current.length) {
          const topLeft = refs.current[topLeftIndex].current.translation();
          const topRight = refs.current[topRightIndex].current.translation();
          const bottomLeft = refs.current[bottomLeftIndex].current.translation();
          const bottomRight = refs.current[bottomRightIndex].current.translation();

          const indexTL = addVertex([topLeft.x, topLeft.y, topLeft.z], [u, v]);
          const indexTR = addVertex([topRight.x, topRight.y, topRight.z], [u + 1 / radialSegments, v]);
          const indexBL = addVertex([bottomLeft.x, bottomLeft.y, bottomLeft.z], [u, v + 1 / radialSegments]);
          const indexBR = addVertex(
            [bottomRight.x, bottomRight.y, bottomRight.z],
            [u + 1 / radialSegments, v + 1 / radialSegments],
          );

          indices.push(indexTL, indexBL, indexBR); // Triangle 1
          indices.push(indexTL, indexBR, indexTR); // Triangle 2
        }
      }
    });

    setNetPoints({ vertices, indices, uvs });
  });

  return (
    <group position={[0, -0.05, 0]}>
      {positions.map((pos, i) => (
        <RigidBody
          key={i}
          ref={refs.current[i]}
          colliders={'ball'}
          restitution={0.02}
          mass={10}
          density={10}
          linearDamping={0.5}
          angularDamping={0.5}
          friction={0.1}
          lockRotations={true}
          type={i < radialSegments ? 'kinematicPosition' : 'dynamic'}
          position={[pos.x, pos.y, pos.z]}
          name="net"
          collisionFilterGroup={SETTINGS.groupKnots}
          collisionFilterMask={SETTINGS.groupBalls}
          onCollisionEnter={(event) => {
            if (event.rigidBody) {
              const currentLinvel = event.rigidBody.linvel();
              const newLinvel = {
                x: currentLinvel.x * 0.97,
                y: currentLinvel.y * 0.9,
                z: currentLinvel.z * 0.97,
              };
              event.rigidBody.setLinvel(newLinvel, true);
            }
          }}
        >
          <Sphere args={[0.045, 4, 4]}>
            <meshStandardMaterial transparent={true} opacity={0} fog={false} />
          </Sphere>
        </RigidBody>
      ))}

      {refs.current.map((_, i) => {
        const row = Math.floor(i / radialSegments);
        let maxVDistance = row === 0 ? 0.5 : row === 1 ? 0.5 : 0.4;
        let maxHDistance = row === 0 ? 0.5 : row === 1 ? 0.38 : 0.34;

        const firstNeighbor = (i + 1) % radialSegments === 0 ? i - radialSegments + 1 : i + 1;
        const secondNeighbor = i - radialSegments;

        return (
          <React.Fragment key={i}>
            {row > 0 && firstNeighbor >= 0 && (
              <NetJoint a={refs.current[i]} b={refs.current[firstNeighbor]} maxDistance={maxHDistance} />
            )}
            {row > 0 && secondNeighbor >= 0 && (
              <NetJoint a={refs.current[i]} b={refs.current[secondNeighbor]} maxDistance={maxVDistance} />
            )}
          </React.Fragment>
        );
      })}

      {netPoints.vertices && netPoints.indices && (
        <NetMesh vertices={netPoints.vertices} indices={netPoints.indices} uvs={netPoints.uvs} />
      )}
    </group>
  );
};
