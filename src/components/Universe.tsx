import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Planet() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.12
  })
  return (
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.35}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshStandardMaterial color="#5540bd" roughness={0.78} metalness={0.18} />
      </mesh>
      <mesh rotation={[1.1, 0.25, 0.3]}>
        <torusGeometry args={[2.05, 0.025, 16, 180]} />
        <meshBasicMaterial color="#46dff5" />
      </mesh>
      <mesh rotation={[1.1, 0.25, 0.3]}>
        <torusGeometry args={[2.16, 0.008, 8, 180]} />
        <meshBasicMaterial color="#a58bff" transparent opacity={0.65} />
      </mesh>
    </Float>
  )
}

export default function Universe() {
  return (
    <div className="universe-canvas" aria-label="Ilustrasi planet NEXORA interaktif">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.1} />
        <pointLight position={[4, 3, 5]} intensity={28} color="#8d7bff" />
        <pointLight position={[-4, -2, -3]} intensity={8} color="#35dff4" />
        <Planet />
        <Stars radius={90} depth={45} count={1600} factor={3} fade speed={0.5} />
        <OrbitControls enablePan={false} minDistance={4.5} maxDistance={8} />
      </Canvas>
    </div>
  )
}
