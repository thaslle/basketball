/* eslint-disable react/no-unknown-property */
export const CloudySky = () => {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={-2}>
        <planeGeometry args={[300, 300]} />
        <meshBasicMaterial color="#e7fffe" fog={true} />
      </mesh>
    </>
  );
};
