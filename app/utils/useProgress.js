import React, { useState, useEffect } from "react";

export default function useProgress(data) {
  let duration = data.current_video_duration;
  let elapsed = data.elapsed_time;
  let progress2 = 0;

  console.log("this shit render " + Math.random());

  useEffect(() => {
    // const inter = setInterval(() => {
    // if (progress2 < 1) {
    //   elapsed = elapsed + 1;
    // }
    progress2 = elapsed / duration;
    // }, 1000);
    // return () => clearInterval(inter);
  }, []);

  return progress2;
}
// export default function useProgress(data) {
//   const [duration, setDuration] = useState(300);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [progress2, setProgress] = useState(0.5);

//   //   useEffect(() => {
//   //     if (data != "abc") {
//   //       setDuration(data.current_video_duration);
//   //       setElapsedTime(data.elapsed_time);
//   //     }
//   //   }, [data]);

//   //   useEffect(() => {
//   //     const intervalId = setInterval(() => {
//   //       if (progress2 < 1) {
//   //         setElapsedTime((t) => t + 1);
//   //       }
//   //     }, 1000);

//   //     return () => clearInterval(intervalId);
//   //   }, []);

//   //   useEffect(() => {
//   //     setProgress(elapsedTime / duration);
//   //   }, [elapsedTime]);
