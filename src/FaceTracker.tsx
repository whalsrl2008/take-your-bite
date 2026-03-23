import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceTracker() {
  const webcamRef = useRef<Webcam>(null);
  const requestRef = useRef<number>(0);
  const [isMouthOpen, setIsMouthOpen] = useState(false);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    const runningMode: "IMAGE" | "VIDEO" = "VIDEO";

    // 💡 마지막 연산 시간을 기록할 변수를 useEffect 내부에 선언합니다.
    let lastExecutionTime = 0;

    const initializeMediaPipe = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: runningMode,
        numFaces: 1,
      });

      // 💡 맨 처음 실행할 때, 현재 시간(performance.now())을 명시적으로 넣어줍니다!
      detectFace(performance.now());
    };

    // 💡 requestAnimationFrame이 넘겨주는 시간 값을 timestamp 파라미터로 받습니다.
    const detectFace = (timestamp: number) => {
      if (webcamRef.current && webcamRef.current.video && faceLandmarker) {
        const video = webcamRef.current.video;

        // 비디오가 켜져 있고, 마지막 검사 후 100ms(0.1초)가 지났을 때만 실행
        if (video.currentTime > 0 && timestamp - lastExecutionTime > 100) {
          lastExecutionTime = timestamp; // 시간 갱신

          const results = faceLandmarker.detectForVideo(
            video,
            performance.now()
          );

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const upperLip = landmarks[13];
            const lowerLip = landmarks[14];
            const distance = Math.abs(upperLip.y - lowerLip.y);

            const mouthOpen = distance > 0.05;
            setIsMouthOpen(mouthOpen);
          }
        }
      }
      // 다음 프레임에 스스로를 다시 예약합니다. (이때 브라우저가 timestamp를 자동으로 넣어줌)
      requestRef.current = requestAnimationFrame(detectFace);
    };

    initializeMediaPipe();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}>
      {/* 테스트용 웹캠 화면 (실제 전시때는 display: 'none'으로 숨길 수 있습니다) */}
      <Webcam
        ref={webcamRef}
        style={{
          width: 200,
          height: 150,
          borderRadius: 10,
          transform: "scaleX(-1)",
        }}
      />
      <div
        style={{
          color: "white",
          background: "black",
          padding: 10,
          marginTop: 10,
          textAlign: "center",
          borderRadius: 5,
        }}
      >
        {isMouthOpen ? "Opened" : "Closed"}
      </div>
    </div>
  );
}
