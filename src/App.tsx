import { useEffect, useState } from "react";
import "./App.css";
import MyModal from "./components/MyModal";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";

function App() {
  type Object = {
    class: string;
    score: number;
  };

  const [model, setModel] = useState<any>(null);
  const [object, setObject] = useState<Object>();

  const loadModel = async () => {
    try {
      const model = await cocoModel.load();
      setModel(model);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    tf.ready().then(() => {
      console.log("Tensorflow ready");
      loadModel();
    });
  }, []);

  const videoOption = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  const predict = async () => {
    console.log("coba prediksi");
    const detection = await model.detect(
      document.getElementById("videoSource") as HTMLVideoElement
    );
    if (detection.length > 0) {
      detection.map((item: any) => {
        const data: { class: string; score: number } = {
          class: item.class,
          score: item.score,
        };
        setObject(data);
      });
    }
    // console.log(detection);
  };

  // console.log(object.class);
  // console.log(object.score);
  return (
    <div className="App flex flex-col gap-4 items-center">
      {/* <h1 className="text-3xl font-bold underline text-red-700">
        Hello world!
      </h1>
      <MyModal /> */}
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Machine learning with tensor flow
      </h1>

      <h3 className="text-3xl font-bold text-red-600 text-center">
        {object ? object.class : ""}
      </h3>
      <h3 className="text-3xl font-bold text-green-600 text-center">
        {object ? object.score : ""}
      </h3>
      <button
        onClick={() => predict()}
        className="p-3 bg-red-500 text-white rounded-xl max-w-3xl"
      >
        Guess object
      </button>
      <div className="flex justify-center">
        <Webcam id="videoSource" audio={false} videoConstraints={videoOption} />
      </div>
    </div>
  );
}

export default App;
